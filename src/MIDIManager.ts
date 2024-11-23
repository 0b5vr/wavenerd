import { EventEmittable } from './utils/EventEmittable';
import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';
import { migrateMIDIManagerStorage } from './migrateMIDIManagerStorage';

interface MidiManagerStorageType {
  version?: number;
  values?: { [ key: string ]: number };
  noteMap?: { [ note: string ]: string }[];
  ccMap?: { [ cc: string ]: string }[];
}

interface MidiManagerEvents {
  noteOn: { note: number; velocity: number };
  noteOff: { note: number; velocity: number };
  ccChange: { cc: number; value: number };
  paramChange: { key: string; value: number };
  learn: { key: string | null };
}

export class MidiManager extends EventEmittable<MidiManagerEvents> {
  private __values: { [ key: string ]: number };
  public get values(): { [ key: string ]: number } {
    return {
      ...this.defaultValues,
      ...this.__values,
    };
  }

  public defaultValues: { [ key: string ]: number };

  private __noteMap: { [ note: number ]: string }[];
  private __ccMap: { [ cc: number ]: string }[];
  private __storage: ThrottledJSONStorage<MidiManagerStorageType>;
  private __learningParam: string | null = null;

  public constructor() {
    super();

    migrateMIDIManagerStorage( 'wavenerd-midiManager' );
    this.__storage = new ThrottledJSONStorage( 'wavenerd-midiManager' );

    this.defaultValues = {};

    this.__values = this.__storage.get( 'values' ) ?? {};
    this.__noteMap = this.__storage.get( 'noteMap' ) ?? [ ...Array( 16 ) ].map( () => ( {} ) );
    this.__ccMap = this.__storage.get( 'ccMap' ) ?? [ ...Array( 16 ) ].map( () => ( {} ) );
  }

  public midi( key: string ): number {
    return this.values[ key ] ?? 0.0;
  }

  public async initMidi(): Promise<void> {
    const access = await navigator.requestMIDIAccess();
    const inputs = access.inputs;
    Array.from( inputs.values() ).forEach( ( input ) => {
      input.addEventListener(
        'midimessage',
        ( event ) => this.__handleMidiMessage( event )
      );

      console.info( `Detected MIDI Device: ${ input.name }` );
    } );
  }

  public learn( key: string ): void {
    this.__learningParam = key;
    this.__emit( 'learn', { key } );
  }

  public clearLearn(): void {
    this.__learningParam = null;
    this.__emit( 'learn', { key: null } );
  }

  public setValue( key: string, value: number ): void {
    this.__values[ key ] = value;

    this.__storage.set( 'values', this.__values );

    this.__emit( 'paramChange', { key, value } );
  }

  private __handleMidiMessage( event: WebMidi.MIDIMessageEvent ): void {
    let paramKey = '';
    let value = 0;

    if ( event.data ) {
      const isNoteOff = event.data[ 0 ] >= 128 && event.data[ 0 ] <= 143;
      const isNoteOn = event.data[ 0 ] >= 144 && event.data[ 0 ] <= 159;
      const isCC = event.data[ 0 ] >= 176 && event.data[ 0 ] <= 191;

      const channel = event.data[ 0 ] % 16;

      if ( isNoteOn ) {
        const note = event.data[ 1 ];
        const velocity = event.data[ 2 ] / 127.0;

        if ( this.__learningParam ) {
          this.__noteMap[ channel ][ note ] = this.__learningParam;
          this.__storage.set( 'noteMap', this.__noteMap );
          this.clearLearn();
        }

        paramKey = this.__noteMap[ channel ][ note ];
        value = velocity;

        this.__emit( 'noteOn', { note, velocity } );

      } else if ( isNoteOff ) {
        const note = event.data[ 1 ];
        const velocity = event.data[ 2 ] / 127.0;

        paramKey = this.__noteMap[ channel ][ note ];
        value = 0.0;

        this.__emit( 'noteOff', { note, velocity } );

      } else if ( isCC ) {
        const cc = event.data[ 1 ];

        if ( this.__learningParam ) {
          this.__ccMap[ channel ][ cc ] = this.__learningParam;
          this.__storage.set( 'ccMap', this.__ccMap );
          this.clearLearn();
        }

        paramKey = this.__ccMap[ channel ][ cc ];
        value = event.data[ 2 ] / 127.0;

        this.__emit( 'ccChange', { cc, value } );
      }
    }

    if ( paramKey ) {
      this.setValue( paramKey, value );
    }
  }
}

export const MIDIMAN = new MidiManager();
MIDIMAN.defaultValues = {
  '/mixer/xfader_pos': 0.5,

  '/mixer/channel_a/gain': 0.5,
  '/mixer/channel_a/eq/high': 0.5,
  '/mixer/channel_a/eq/mid': 0.5,
  '/mixer/channel_a/eq/low': 0.5,
  '/mixer/channel_a/volume': 1.0,

  '/mixer/channel_b/gain': 0.5,
  '/mixer/channel_b/eq/high': 0.5,
  '/mixer/channel_b/eq/mid': 0.5,
  '/mixer/channel_b/eq/low': 0.5,
  '/mixer/channel_b/volume': 1.0,
};
MIDIMAN.initMidi();
