import { EventEmittable } from '../utils/EventEmittable';

export const ANALYSER_TIME_DOMAIN_SIZE = 4096;
export const ANALYSER_FREQUENCY_SIZE = 1024;
export const ANALYSER_ZERO_CROSSING_TARGET = 1024;

export interface AnalyserResult {
  deltaTime: number;
  timeDomainL: Float32Array;
  timeDomainR: Float32Array;
  timeDomainLoL: Float32Array;
  zeroCrossingLoL: number;
  frequencyL: Float32Array;
  frequencyR: Float32Array;
}

interface AnalyserEvents {
  update: AnalyserResult;
}

export class Analyser extends EventEmittable<AnalyserEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __splitterNode: ChannelSplitterNode;
  private __analyserNodeL: AnalyserNode;
  private __analyserNodeR: AnalyserNode;
  private __lpfL: BiquadFilterNode;
  private __analyserNodeLoL: AnalyserNode;

  public get input(): AudioNode {
    return this.__splitterNode;
  }

  public timeDomainL: Float32Array;
  public timeDomainR: Float32Array;
  public timeDomainLoL: Float32Array;
  public zeroCrossingLoL: number;
  public frequencyL: Float32Array;
  public frequencyR: Float32Array;

  public constructor(audio: AudioContext) {
    super();

    this.__audio = audio;

    this.__splitterNode = audio.createChannelSplitter(2);
    this.__analyserNodeL = audio.createAnalyser();
    this.__analyserNodeR = audio.createAnalyser();
    this.__lpfL = audio.createBiquadFilter();
    this.__analyserNodeLoL = audio.createAnalyser();

    this.__analyserNodeL.fftSize = 4096;
    this.__analyserNodeR.fftSize = 4096;
    this.__analyserNodeLoL.fftSize = 4096;

    this.__lpfL.type = 'lowpass';
    this.__lpfL.frequency.value = 200;

    this.__splitterNode.connect(this.__analyserNodeL, 0);
    this.__splitterNode.connect(this.__analyserNodeR, 1);
    this.__splitterNode.connect(this.__lpfL, 0);
    this.__lpfL.connect(this.__analyserNodeLoL);

    this.timeDomainL = new Float32Array(ANALYSER_TIME_DOMAIN_SIZE);
    this.timeDomainR = new Float32Array(ANALYSER_TIME_DOMAIN_SIZE);
    this.timeDomainLoL = new Float32Array(ANALYSER_TIME_DOMAIN_SIZE);
    this.frequencyL = new Float32Array(ANALYSER_FREQUENCY_SIZE);
    this.frequencyR = new Float32Array(ANALYSER_FREQUENCY_SIZE);
    this.zeroCrossingLoL = 0;
  }

  public update(deltaTime: number): AnalyserResult {
    this.__analyserNodeL.getFloatTimeDomainData(this.timeDomainL);
    this.__analyserNodeR.getFloatTimeDomainData(this.timeDomainR);
    this.__analyserNodeLoL.getFloatTimeDomainData(this.timeDomainLoL);
    this.__analyserNodeL.getFloatFrequencyData(this.frequencyL);
    this.__analyserNodeR.getFloatFrequencyData(this.frequencyR);

    // find zero crossing
    {
      const target = ANALYSER_ZERO_CROSSING_TARGET;
      let d = target;
      let v = 0;

      for (let i = 0; i < this.timeDomainLoL.length; i++) {
        if (i >= target + d) {
          break;
        }

        const v1 = this.timeDomainLoL[i];
        if (v < 0 && v1 >= 0) {
          const d1 = Math.abs(i - target);
          if (d1 < d) {
            d = d1;
            this.zeroCrossingLoL = i;
          }
        }
        v = this.timeDomainLoL[i];
      }
    }

    const ret = {
      deltaTime: deltaTime,
      timeDomainL: this.timeDomainL,
      timeDomainR: this.timeDomainR,
      timeDomainLoL: this.timeDomainLoL,
      zeroCrossingLoL: this.zeroCrossingLoL,
      frequencyL: this.frequencyL,
      frequencyR: this.frequencyR,
    };

    this.__emit('update', ret);

    return ret;
  }
}
