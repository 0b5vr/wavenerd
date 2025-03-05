import { linearstep } from '@0b5vr/experimental';
import { MixerFilter } from './MixerFilter';

export class MixerFilterBiquad extends MixerFilter {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private readonly __gainInput: GainNode;
  private readonly __filterLPF: BiquadFilterNode;
  private readonly __filterHPF: BiquadFilterNode;
  private readonly __gainOutput: GainNode;
  private __filter: number;

  public get filter(): number {
    return this.__filter;
  }

  public set filter(value: number) {
    this.__filter = value;

    const time = this.__audio.currentTime + 0.005;

    const normalizedLow = linearstep(0.0, 0.5, value);
    const low = 20.0 * Math.pow(1000.0, normalizedLow);
    this.__filterLPF.frequency.linearRampToValueAtTime(low, time);

    const normalizedHigh = linearstep(0.5, 1.0, value);
    const high = 20.0 * Math.pow(1000.0, normalizedHigh);
    this.__filterHPF.frequency.linearRampToValueAtTime(high, time);

    this.__emit('change', { filter: value });
  }

  public get input(): AudioNode {
    return this.__gainInput;
  }

  public get output(): AudioNode {
    return this.__gainOutput;
  }

  constructor(audio: AudioContext) {
    super();

    this.__audio = audio;

    this.__gainInput = audio.createGain();
    this.__gainOutput = audio.createGain();

    this.__filterLPF = audio.createBiquadFilter();
    this.__filterLPF.type = 'lowpass';
    this.__filterLPF.Q.value = 0.0;

    this.__filterHPF = audio.createBiquadFilter();
    this.__filterHPF.type = 'highpass';
    this.__filterHPF.Q.value = 0.0;

    this.__filter = 0.5;
    this.filter = 0.5; // Initialize at center position

    this.__gainInput.connect(this.__filterLPF);
    this.__filterLPF.connect(this.__filterHPF);
    this.__filterHPF.connect(this.__gainOutput);
  }
}
