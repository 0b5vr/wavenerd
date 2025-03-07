import { LINEAR_RAMP_TIME } from './constants';

export class Reverb extends GainNode {
  private readonly __audio: AudioContext;
  private readonly __input: GainNode;
  private readonly __dryGain: GainNode;
  private readonly __wetGain: GainNode;
  private readonly __convolver: ConvolverNode;

  public get input(): AudioNode {
    return this.__input;
  }

  public get mix(): number {
    return this.__wetGain.gain.value;
  }

  public set mix(value: number) {
    const time = this.__audio.currentTime + LINEAR_RAMP_TIME;

    this.__dryGain.gain.linearRampToValueAtTime(1.0 - value, time);
    this.__wetGain.gain.linearRampToValueAtTime(value, time);
  }

  public constructor(audio: AudioContext) {
    super(audio);

    this.__audio = audio;

    this.__input = audio.createGain();
    this.__dryGain = audio.createGain();
    this.__wetGain = audio.createGain();
    this.__convolver = audio.createConvolver();

    this.__wetGain.gain.value = 0.0;

    this.__convolver.buffer = this.__createIR();

    this.__input.connect(this.__dryGain);
    this.__input.connect(this.__convolver);
    this.__convolver.connect(this.__wetGain);
    this.__dryGain.connect(this);
    this.__wetGain.connect(this);
  }

  /**
   * cringe
   */
  private __createIR(): AudioBuffer {
    const audio = this.__audio;

    const sampleRate = audio.sampleRate;
    const samples = 4.0 * sampleRate;
    const buffer = audio.createBuffer(2, samples, sampleRate);

    for (let iCh = 0; iCh < 2; iCh++) {
      const ch = buffer.getChannelData(iCh);

      for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        ch[i] = (Math.random() - 0.5) * Math.exp(-5.0 * t);
      }
    }

    return buffer;
  }
}
