import { Analyser, AnalyserResult } from './Analyser';
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
  public readonly analyser: Analyser;

  private __level = 0.0;
  private __levelL = 0.0;
  private __levelR = 0.0;
  private __peak = 0.0;
  private __peakL = 0.0;
  private __peakR = 0.0;
  private __vpeak = 0.0;
  private __vpeakL = 0.0;
  private __vpeakR = 0.0;

  public constructor( analyser: Analyser ) {
    super();

    this.analyser = analyser;
    this.analyser.on( 'update', ( result ) => {
      this.__update( result );
    } );
  }

  private __update( result: AnalyserResult ): LevelMeterResult {
    const { deltaTime, timeDomainL, timeDomainR } = result;

    const decay = Math.exp( -5.0 * deltaTime );

    this.__levelL *= decay;
    timeDomainL.forEach( ( v ) => {
      this.__levelL = Math.max( this.__levelL, Math.abs( v ) );
    } );

    this.__levelR *= decay;
    timeDomainR.forEach( ( v ) => {
      this.__levelR = Math.max( this.__levelR, Math.abs( v ) );
    } );

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
