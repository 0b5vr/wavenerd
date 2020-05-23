import { EventEmittable } from './utils/EventEmittable';

interface MidiManagerStorage {
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
  private __params: { [ key: string ]: number } = {};

  public get params(): { [ key: string ]: number } {
    return this.__params;
  }

  private __ccValues: number[];

  public get ccValues(): number[] {
    return this.__ccValues;
  }

  private __noteMap: { [ note: number ]: string };
  private __ccMap: { [ cc: number ]: string };
  private __storage: MidiManagerStorage;
  private __learningParam: string | null = null;

  public constructor() {
    super();

    this.__storage = this.__loadStorage();
    this.__noteMap = this.__storage.noteMap;
    this.__ccMap = this.__storage.ccMap;
    this.__ccValues = this.__storage.ccValues;
  }

  public midi( key: string ): number {
    if ( !this.__params[ key ] ) {
      this.__createParam( key );
    }

    return this.__params[ key ];
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
    if ( !this.__params[ key ] ) { return; }

    this.__params[ key ] = value;
    this.__storage.values[ key ] = value;
    this.__writeStorage();
  }

  private __loadStorage(): MidiManagerStorage {
    return localStorage.midiManager
      ? JSON.parse( localStorage.midiManager )
      : { values: {}, noteMap: {}, ccMap: {}, ccValues: new Array( 128 ).fill( 0 ) };
  }

  private __writeStorage(): void {
    localStorage.midiManager = JSON.stringify( this.__storage );
  }

  private __createParam( key: string ): void {
    this.__params[ key ] = this.__storage.values[ key ] || 0.0;
  }

  private __changeValue( key: string, value: number ): void {
    this.__params[ key ] = value;

    this.__emit( 'paramChange', {
      key,
      value
    } );

    this.__storage.values[ key ] = value;
    this.__writeStorage();
  }

  private __handleMidiMessage( event: WebMidi.MIDIMessageEvent ): void {
    let paramKey = '';
    let value = 0;

    if ( event.data && event.data[ 0 ] === 128 || event.data[ 0 ] === 144 ) { // channel 0, note on / off
      if ( this.__learningParam ) {
        this.__noteMap[ event.data[ 1 ] ] = this.__learningParam;
        this.__storage.noteMap[ event.data[ 1 ] ] = this.__learningParam;
        this.__writeStorage();
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
        this.__storage.ccMap[ event.data[ 1 ] ] = this.__learningParam;
        this.__writeStorage();
        this.__learningParam = null;
        this.__emit( 'learn', { key: null } );
      }

      paramKey = this.__ccMap[ event.data[ 1 ] ];
      value = event.data[ 2 ] / 127.0;

      this.__ccValues[ event.data[ 1 ] ] = event.data[ 2 ] / 127.0;
      this.__storage.ccValues[ event.data[ 1 ] ] = event.data[ 2 ] / 127.0;
      this.__writeStorage();

      this.__emit( 'ccChange', {
        cc: event.data[ 1 ],
        value: event.data[ 2 ] / 127.0
      } );
    }

    if ( paramKey ) {
      this.__changeValue( paramKey, value );
    }
  }
}

export const MIDIMAN = new MidiManager();
MIDIMAN.initMidi();
