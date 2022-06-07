import { LevelMeter, LevelMeterResult } from './LevelMeter';
import { EventEmittable } from './utils/EventEmittable';
import { linearstep } from '@0b5vr/experimental';

interface MixerEvents {
  changeVolumeL: { value: number };
  changeVolumeR: { value: number };
  changeXFader: { value: number };
  updateLevelMeters: {
    inputL: LevelMeterResult;
    inputR: LevelMeterResult;
    output: LevelMeterResult;
  };
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
  private __gainXFaderL: GainNode;
  private __gainXFaderR: GainNode;
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

  private __levelMeterInputL: LevelMeter;
  private __levelMeterInputR: LevelMeter;
  private __levelMeterOutput: LevelMeter;

  public constructor( audio: AudioContext ) {
    super();

    this.__audio = audio;

    this.__gainNodeL = audio.createGain();
    this.__gainNodeR = audio.createGain();
    this.__gainXFaderL = audio.createGain();
    this.__gainXFaderR = audio.createGain();
    this.__gainNodeOut = audio.createGain();

    this.__gainNodeL.connect( this.__gainXFaderL );
    this.__gainNodeR.connect( this.__gainXFaderR );
    this.__gainXFaderL.connect( this.__gainNodeOut );
    this.__gainXFaderR.connect( this.__gainNodeOut );

    this.__levelMeterInputL = new LevelMeter( audio );
    this.__levelMeterInputR = new LevelMeter( audio );
    this.__levelMeterOutput = new LevelMeter( audio );

    this.__gainNodeL.connect( this.__levelMeterInputL.input );
    this.__gainNodeR.connect( this.__levelMeterInputR.input );
    this.__gainNodeOut.connect( this.__levelMeterOutput.input );
  }

  public updateLevelMeter( deltaTime: number ): {
    inputL: LevelMeterResult;
    inputR: LevelMeterResult;
    output: LevelMeterResult;
  } {
    const inputL = this.__levelMeterInputL.update( deltaTime );
    const inputR = this.__levelMeterInputR.update( deltaTime );
    const output = this.__levelMeterOutput.update( deltaTime );

    const ret = { inputL, inputR, output };

    this.__emit( 'updateLevelMeters', ret );

    return ret;
  }

  private __updateGains(): void {
    this.__gainNodeL.gain.linearRampToValueAtTime(
      this.__volumeL,
      this.__audio.currentTime + 0.02
    );

    this.__gainNodeR.gain.linearRampToValueAtTime(
      this.__volumeR,
      this.__audio.currentTime + 0.02
    );

    this.__gainXFaderL.gain.linearRampToValueAtTime(
      linearstep( 0.95, 0.55, this.__xFaderPos ),
      this.__audio.currentTime + 0.02
    );

    this.__gainXFaderR.gain.linearRampToValueAtTime(
      linearstep( 0.05, 0.45, this.__xFaderPos ),
      this.__audio.currentTime + 0.02
    );
  }
}
