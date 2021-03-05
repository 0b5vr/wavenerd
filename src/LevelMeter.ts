import { EventEmittable } from './utils/EventEmittable';

export interface LevelMeterResult {
  level: number;
  levelL: number;
  levelR: number;
  peak: number;
  peakL: number;
  peakR: number;
}

interface LevelMeterEvents {
  update: LevelMeterResult;
}

export class LevelMeter extends EventEmittable<LevelMeterEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __gainNode: GainNode;
  private __splitterNode: ChannelSplitterNode;
  private __analyserNodeL: AnalyserNode;
  private __analyserNodeR: AnalyserNode;

  public get input(): AudioNode {
    return this.__gainNode;
  }

  private __buffer: Float32Array;

  private __level = 0.0;
  private __levelL = 0.0;
  private __levelR = 0.0;
  private __peak = 0.0;
  private __peakL = 0.0;
  private __peakR = 0.0;
  private __vpeak = 0.0;
  private __vpeakL = 0.0;
  private __vpeakR = 0.0;

  public constructor( audio: AudioContext ) {
    super();

    this.__audio = audio;

    this.__gainNode = audio.createGain();
    this.__splitterNode = audio.createChannelSplitter( 2 );
    this.__analyserNodeL = audio.createAnalyser();
    this.__analyserNodeR = audio.createAnalyser();

    this.__gainNode.connect( this.__splitterNode );
    this.__splitterNode.connect( this.__analyserNodeL, 0 );
    this.__splitterNode.connect( this.__analyserNodeR, 1 );

    this.__buffer = new Float32Array( 256 );
  }

  public update( deltaTime: number ): LevelMeterResult {
    const decay = Math.exp( -5.0 * deltaTime );

    this.__levelL *= decay;
    this.__analyserNodeL.getFloatTimeDomainData( this.__buffer );
    for ( let i = 0; i < 256; i ++ ) {
      this.__levelL = Math.max( this.__levelL, Math.abs( this.__buffer[ i ] ) );
    }

    this.__levelR *= decay;
    this.__analyserNodeR.getFloatTimeDomainData( this.__buffer );
    for ( let i = 0; i < 256; i ++ ) {
      this.__levelR = Math.max( this.__levelR, Math.abs( this.__buffer[ i ] ) );
    }

    this.__level = Math.max( this.__levelL, this.__levelR );

    this.__vpeakL -= 0.01 * deltaTime;
    this.__peakL = Math.max( 0.0, this.__peakL + this.__vpeakL );
    if ( this.__peakL < this.__levelL ) {
      this.__peakL = this.__levelL;
      this.__vpeakL = 0.0;
    }

    this.__vpeakR -= 0.01 * deltaTime;
    this.__peakR = Math.max( 0.0, this.__peakR + this.__vpeakR );
    if ( this.__peakR < this.__levelR ) {
      this.__peakR = this.__levelR;
      this.__vpeakR = 0.0;
    }

    this.__vpeak -= 0.01 * deltaTime;
    this.__peak = Math.max( 0.0, this.__peak + this.__vpeak );
    if ( this.__peak < this.__level ) {
      this.__peak = this.__level;
      this.__vpeak = 0.0;
    }

    const ret = {
      level: this.__level,
      levelL: this.__levelL,
      levelR: this.__levelR,
      peak: this.__peak,
      peakL: this.__peakL,
      peakR: this.__peakR,
    };

    this.__emit( 'update', ret );

    return ret;
  }
}
