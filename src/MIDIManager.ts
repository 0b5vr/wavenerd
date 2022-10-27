import { EventEmittable } from './utils/EventEmittable';
import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';

interface MidiManagerStorageType {
  values: { [ key: string ]: number };
  noteMap: { [ note: number ]: string };
  ccMap: { [ cc: number ]: string };
  ccValues: number[];
}

interface MidiManagerEvents {
  noteOn: { note: number; velocity: number };
  noteOff: { note: number; velocity: number };
  ccChange: { cc: number; value: number };
  paramChange: { key: string; value: number };
  learn: { key: string | null };
}

export class MidiManager extends EventEmittable<MidiManagerEvents> {
  private __ccValues: number[];

  public get ccValues(): number[] {
    return this.__ccValues;
  }

  private __values: { [ key: string ]: number };
  public get values(): { [ key: string ]: number } {
    return this.__values;
  }

  private __noteMap: { [ note: number ]: string };
  private __ccMap: { [ cc: number ]: string };
  private __storage: ThrottledJSONStorage<MidiManagerStorageType>;
  private __learningParam: string | null = null;

  public constructor() {
    super();

    this.__storage = new ThrottledJSONStorage( 'wavenerd-midiManager' );

    this.__values = this.__storage.get( 'values' ) ?? {};
    this.__noteMap = this.__storage.get( 'noteMap' ) ?? {};
    this.__ccMap = this.__storage.get( 'ccMap' ) ?? {};
    this.__ccValues = this.__storage.get( 'ccValues' ) ?? [ ...Array( 128 ) ].fill( 0 );
  }

  public midi( key: string ): number {
    return this.__values[ key ] ?? 0.0;
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

  public setValue( key: string, value: number ): void {
    this.__values[ key ] = value;

    this.__storage.set( 'values', this.__values );

    this.__emit( 'paramChange', {
      key,
      value
    } );
  }

  private __handleMidiMessage( event: WebMidi.MIDIMessageEvent ): void {
    let paramKey = '';
    let value = 0;

    if ( event.data && event.data[ 0 ] === 128 || event.data[ 0 ] === 144 ) { // channel 0, note on / off
      if ( this.__learningParam ) {
        this.__noteMap[ event.data[ 1 ] ] = this.__learningParam;
        this.__storage.set( 'noteMap', this.__noteMap );
        this.__learningParam = null;
        this.__emit( 'learn', { key: null } );
      }

      paramKey = this.__noteMap[ event.data[ 1 ] ];
      value = event.data[ 0 ] === 128 ? 0.0 : event.data[ 2 ] / 127.0;

      this.__emit( event.data[ 0 ] === 128 ? 'noteOff' : 'noteOn', {
        note: event.data[ 1 ],
        velocity: event.data[ 2 ] / 127.0
      } );

    } else if ( event.data && event.data[ 0 ] === 176 ) { // channel 0, control changes
      if ( this.__learningParam ) {
        this.__ccMap[ event.data[ 1 ] ] = this.__learningParam;
        this.__storage.set( 'ccMap', this.__ccMap );
        this.__learningParam = null;
        this.__emit( 'learn', { key: null } );
      }

      paramKey = this.__ccMap[ event.data[ 1 ] ];
      value = event.data[ 2 ] / 127.0;

      this.__ccValues[ event.data[ 1 ] ] = event.data[ 2 ] / 127.0;
      this.__storage.set( 'ccValues', this.__ccValues );

      this.__emit( 'ccChange', {
        cc: event.data[ 1 ],
        value: event.data[ 2 ] / 127.0
      } );
    }

    if ( paramKey ) {
      this.setValue( paramKey, value );
    }
  }
}

export const MIDIMAN = new MidiManager();
MIDIMAN.initMidi();
