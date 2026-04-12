import { type Analyser } from './Analyser';
import { EventEmittable } from '../utils/EventEmittable';

const ENV_SIZE_MAX = 2048;

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

  public constructor(analyser: Analyser) {
    super();
    this.analyser = analyser;
  }

  public update(deltaTime: number): LevelMeterResult {
    const { timeDomainL, timeDomainR } = this.analyser;

    const decay = Math.exp(-5.0 * deltaTime);

    // simple envelope follower
    const envSize = Math.min(~~(this.analyser.audio.sampleRate * deltaTime), ENV_SIZE_MAX);

    this.__levelL *= decay;
    for (let i = timeDomainL.length - envSize; i < timeDomainL.length; i++) {
      this.__levelL = Math.max(this.__levelL, Math.abs(timeDomainL[i]));
    }

    this.__levelR *= decay;
    for (let i = timeDomainR.length - envSize; i < timeDomainR.length; i++) {
      this.__levelR = Math.max(this.__levelR, Math.abs(timeDomainR[i]));
    }

    // take the maximum among left and right channels
    this.__level = Math.max(this.__levelL, this.__levelR);

    // the peak indicator falls down with a velocity
    this.__vpeakL -= 0.01 * deltaTime;
    this.__peakL = Math.max(0.0, this.__peakL + this.__vpeakL);
    if (this.__peakL < this.__levelL) {
      this.__peakL = this.__levelL;
      this.__vpeakL = 0.0;
    }

    this.__vpeakR -= 0.01 * deltaTime;
    this.__peakR = Math.max(0.0, this.__peakR + this.__vpeakR);
    if (this.__peakR < this.__levelR) {
      this.__peakR = this.__levelR;
      this.__vpeakR = 0.0;
    }

    this.__vpeak -= 0.01 * deltaTime;
    this.__peak = Math.max(0.0, this.__peak + this.__vpeak);
    if (this.__peak < this.__level) {
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

    this.__emit('update', ret);

    return ret;
  }
}
