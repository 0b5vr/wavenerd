import { type Analyser } from './Analyser';

const ENV_SIZE_MAX = 2048;

export class LevelMeter {
  public readonly analyser: Analyser;

  private __level = 0.0;
  public get level(): number {
    return this.__level;
  }

  private __levelL = 0.0;
  public get levelL(): number {
    return this.__levelL;
  }

  private __levelR = 0.0;
  public get levelR(): number {
    return this.__levelR;
  }

  private __peak = 0.0;
  public get peak(): number {
    return this.__peak;
  }

  private __peakL = 0.0;
  public get peakL(): number {
    return this.__peakL;
  }

  private __peakR = 0.0;
  public get peakR(): number {
    return this.__peakR;
  }

  private __vpeak = 0.0;
  private __vpeakL = 0.0;
  private __vpeakR = 0.0;

  public constructor(analyser: Analyser) {
    this.analyser = analyser;
  }

  public update(deltaTime: number): void {
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
  }
}
