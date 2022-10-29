import { Analyser } from './Analyser';
import { EventEmittable } from './utils/EventEmittable';
import { LevelMeter } from './LevelMeter';
import { SETTINGSMAN } from './SettingsManager';
import { xfaderCurveConstantPower } from './xfaderCurveConstantPower';
import { xfaderCurveCut } from './xfaderCurveCut';
import { xfaderCurveLinear } from './xfaderCurveLinear';
import { xfaderCurveTransition } from './xfaderCurveTransition';

export type XFaderModeType = 'constantPower' | 'cut' | 'linear' | 'transition';

interface MixerEvents {
  changeVolumeA: { value: number };
  changeVolumeB: { value: number };
  changeXFader: { value: number };
}

export class Mixer extends EventEmittable<MixerEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __volumeA = 1.0;
  public get volumeA(): number {
    return this.__volumeA;
  }
  public set volumeA( value: number ) {
    this.__volumeA = value;
    this.__updateGains();
    this.__emit( 'changeVolumeA', { value } );
  }

  private __volumeB = 1.0;
  public get volumeB(): number {
    return this.__volumeB;
  }
  public set volumeB( value: number ) {
    this.__volumeB = value;
    this.__updateGains();
    this.__emit( 'changeVolumeB', { value } );
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

  private __gainNodeA: GainNode;
  private __gainNodeB: GainNode;
  private __gainXFaderA: GainNode;
  private __gainXFaderB: GainNode;
  private __gainNodeOut: GainNode;

  public get inputA(): AudioNode {
    return this.__gainNodeA;
  }

  public get inputB(): AudioNode {
    return this.__gainNodeB;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  public readonly analyserInA: Analyser;
  public readonly analyserInB: Analyser;
  public readonly analyserOut: Analyser;

  public readonly levelMeterInA: LevelMeter;
  public readonly levelMeterInB: LevelMeter;
  public readonly levelMeterOut: LevelMeter;

  public constructor( audio: AudioContext ) {
    super();

    this.__audio = audio;

    this.__gainNodeA = audio.createGain();
    this.__gainNodeB = audio.createGain();
    this.__gainXFaderA = audio.createGain();
    this.__gainXFaderB = audio.createGain();
    this.__gainNodeOut = audio.createGain();

    this.__gainNodeA.connect( this.__gainXFaderA );
    this.__gainNodeB.connect( this.__gainXFaderB );
    this.__gainXFaderA.connect( this.__gainNodeOut );
    this.__gainXFaderB.connect( this.__gainNodeOut );

    this.analyserInA = new Analyser( audio );
    this.analyserInB = new Analyser( audio );
    this.analyserOut = new Analyser( audio );

    this.__gainNodeA.connect( this.analyserInA.input );
    this.__gainNodeB.connect( this.analyserInB.input );
    this.__gainNodeOut.connect( this.analyserOut.input );

    this.levelMeterInA = new LevelMeter( this.analyserInA );
    this.levelMeterInB = new LevelMeter( this.analyserInB );
    this.levelMeterOut = new LevelMeter( this.analyserOut );

    SETTINGSMAN.on( 'changeXFaderMode', () => {
      this.__updateGains();
    } );
  }

  public updateAnalyser( deltaTime: number ): void {
    this.analyserInA.update( deltaTime );
    this.analyserInB.update( deltaTime );
    this.analyserOut.update( deltaTime );
  }

  private __updateGains(): void {
    const [ a, b ] = this.__getXFaderValue();

    const time = this.__audio.currentTime + 0.005;

    this.__gainNodeA.gain.linearRampToValueAtTime( this.__volumeA, time );
    this.__gainNodeB.gain.linearRampToValueAtTime( this.__volumeB, time );

    this.__gainXFaderA.gain.linearRampToValueAtTime( a, time );
    this.__gainXFaderB.gain.linearRampToValueAtTime( b, time );
  }

  private __getXFaderValue(): [ number, number ] {
    const x = this.__xFaderPos;
    const mode = SETTINGSMAN.xfaderMode;

    return (
      mode === 'constantPower' ? xfaderCurveConstantPower( x ) :
      mode === 'cut' ? xfaderCurveCut( x ) :
      mode === 'linear' ? xfaderCurveLinear( x ) :
      xfaderCurveTransition( x )
    );
  }
}
