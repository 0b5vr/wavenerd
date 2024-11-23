import { MixerEQ, MixerEQChangeEvent } from './MixerEQ';
import { EventEmittable } from './utils/EventEmittable';
import { MixerEQIsolator } from './MixerEQIsolator';
import { MixerEQNone } from './MixerEQNone';

export type MixerEQMode = 'none' | 'isolator';

export interface MixerChannelChangeEvent {
  gain?: number;
  eq?: MixerEQChangeEvent;
  eqMode?: MixerEQMode;
  volume?: number;
}

interface MixerChannelEvents {
  change: MixerChannelChangeEvent;
}

export class MixerChannel extends EventEmittable<MixerChannelEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __gain = 1.0;
  public get gain(): number {
    return this.__gain;
  }
  public set gain( value: number ) {
    this.__gain = value;

    const time = this.__audio.currentTime + 0.005;
    this.__gainNode.gain.linearRampToValueAtTime( this.__gain, time );

    this.__emit( 'change', { gain: value } );
  }

  private __volume = 1.0;
  public get volume(): number {
    return this.__volume;
  }
  public set volume( value: number ) {
    this.__volume = value;

    const time = this.__audio.currentTime + 0.005;
    this.__gainNodeOut.gain.linearRampToValueAtTime( this.__volume, time );

    this.__emit( 'change', { volume: value } );
  }

  private __eq: MixerEQ;
  public get eq(): MixerEQ {
    return this.__eq;
  }

  private __eqChangeHandler: ( event: MixerEQChangeEvent ) => void;

  private __gainNode: GainNode;
  private __gainNodeOut: GainNode;
  private __gainNodeOutForAnal: GainNode;

  public get input(): AudioNode {
    return this.__gainNode;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  public get outputForAnal(): AudioNode {
    return this.__gainNodeOutForAnal;
  }

  public constructor( audio: AudioContext ) {
    super();

    this.__audio = audio;

    this.__gainNode = audio.createGain();
    this.__gainNodeOut = audio.createGain();
    this.__gainNodeOutForAnal = audio.createGain();

    this.__eq = new MixerEQNone( audio );

    this.__eqChangeHandler = this.__eq.on( 'change', ( event ) => (
      this.__emit( 'change', { eq: event } )
    ) );

    this.__gainNode.connect( this.__eq.input );
    this.__eq.output.connect( this.__gainNodeOut );
    this.__eq.output.connect( this.__gainNodeOutForAnal );
  }

  public replaceEQ( mode: MixerEQMode ): void {
    const { low, mid, high } = this.__eq;

    this.__eq.off( 'change', this.__eqChangeHandler );

    this.__gainNode.disconnect();
    this.__eq.output.disconnect();

    if ( mode === 'none' ) {
      this.__eq = new MixerEQNone( this.__audio );
    } else if ( mode === 'isolator' ) {
      this.__eq = new MixerEQIsolator( this.__audio );
    }

    this.__eq.low = low;
    this.__eq.mid = mid;
    this.__eq.high = high;

    this.__eqChangeHandler = this.__eq.on( 'change', ( event ) => (
      this.__emit( 'change', { eq: event } )
    ) );

    this.__gainNode.connect( this.__eq.input );
    this.__eq.output.connect( this.__gainNodeOut );
    this.__eq.output.connect( this.__gainNodeOutForAnal );
  }
}
