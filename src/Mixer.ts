import { EventEmittable } from './utils/EventEmittable';
import { linearstep } from '@fms-cat/experimental';

interface MixerEvents {
  changeVolumeL: { value: number };
  changeVolumeR: { value: number };
  changeXFader: { value: number };
}

export class Mixer extends EventEmittable<MixerEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __volumeL = 1.0;
  public get volumeL(): number {
    return this.__volumeL;
  }
  public set volumeL( value: number ) {
    this.__volumeL = value;
    this.__updateGains();
    this.__emit( 'changeVolumeL', { value } );
  }

  private __volumeR = 1.0;
  public get volumeR(): number {
    return this.__volumeR;
  }
  public set volumeR( value: number ) {
    this.__volumeR = value;
    this.__updateGains();
    this.__emit( 'changeVolumeR', { value } );
  }

  private __xFaderPos = 0.5;
  public get xFaderPos(): number {
    return this.__xFaderPos;
  }
  public set xFaderPos( value: number ) {
    this.__xFaderPos = value;
    this.__updateGains();
    this.__emit( 'changeXFader', { value } );
  }

  private __gainNodeL: GainNode;
  private __gainNodeR: GainNode;
  private __gainNodeOut: GainNode;

  public get inputL(): AudioNode {
    return this.__gainNodeL;
  }

  public get inputR(): AudioNode {
    return this.__gainNodeR;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  public constructor( audio: AudioContext ) {
    super();

    this.__audio = audio;

    this.__gainNodeL = audio.createGain();
    this.__gainNodeR = audio.createGain();
    this.__gainNodeOut = audio.createGain();

    this.__gainNodeL.connect( this.__gainNodeOut );
    this.__gainNodeR.connect( this.__gainNodeOut );
  }

  private __updateGains(): void {
    this.__gainNodeL.gain.linearRampToValueAtTime(
      this.__volumeL * linearstep( 0.95, 0.55, this.__xFaderPos ),
      this.__audio.currentTime + 0.01
    );
    this.__gainNodeR.gain.linearRampToValueAtTime(
      this.__volumeR * linearstep( 0.05, 0.45, this.__xFaderPos ),
      this.__audio.currentTime + 0.01
    );
  }
}
