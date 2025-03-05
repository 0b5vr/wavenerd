import { lerp, linearstep } from '@0b5vr/experimental';
import { MixerFilter } from './MixerFilter';
import { BlendNode } from './BlendNode';
import { LINEAR_RAMP_TIME } from './constants';

const LOG2_MIN_FREQ = Math.log2(20.0);
const LOG2_MAX_FREQ = Math.log2(20000.0);

export class MixerFilterBiquad extends MixerFilter {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private readonly __gainInput: GainNode;
  private readonly __gainOutput: GainNode;

  private readonly __blendLPF: BlendNode;
  private readonly __blendHPF: BlendNode;

  private readonly __filterLPF: BiquadFilterNode;
  private readonly __filterHPF: BiquadFilterNode;

  private __filter: number;

  public get filter(): number {
    return this.__filter;
  }

  public set filter(value: number) {
    this.__filter = value;

    const time = this.__audio.currentTime + LINEAR_RAMP_TIME;

    const lpfWet = linearstep(0.5, 0.45, value);
    this.__blendLPF.blend = lpfWet;

    const lpfKill = linearstep(0.0, 0.05, value);
    this.__blendLPF.gain.linearRampToValueAtTime(lpfKill, time);

    const lpfFreq = Math.pow(2.0, lerp(LOG2_MIN_FREQ, LOG2_MAX_FREQ, linearstep(0.0, 0.5, value)));
    this.__filterLPF.frequency.linearRampToValueAtTime(lpfFreq, time);

    const hpfWet = linearstep(0.5, 0.55, value);
    this.__blendHPF.blend = hpfWet;

    const hpfKill = linearstep(1.0, 0.95, value);
    this.__blendHPF.gain.linearRampToValueAtTime(hpfKill, time);

    const hpfFreq = Math.pow(2.0, lerp(LOG2_MIN_FREQ, LOG2_MAX_FREQ, linearstep(0.5, 1.0, value)));
    this.__filterHPF.frequency.linearRampToValueAtTime(hpfFreq, time);

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

    this.__blendLPF = new BlendNode(audio);
    this.__blendHPF = new BlendNode(audio);

    this.__filterLPF = audio.createBiquadFilter();
    this.__filterLPF.type = 'lowpass';
    this.__filterLPF.Q.value = 0.0;
    this.__filterLPF.gain.value = 0.0;

    this.__filterHPF = audio.createBiquadFilter();
    this.__filterHPF.type = 'highpass';
    this.__filterHPF.Q.value = 0.0;
    this.__filterHPF.gain.value = 0.0;

    this.__filter = 0.5;
    this.filter = 0.5;

    this.__gainInput.connect(this.__filterLPF);
    this.__gainInput.connect(this.__blendLPF.inputA);
    this.__filterLPF.connect(this.__blendLPF.inputB);
    this.__blendLPF.connect(this.__filterHPF);
    this.__blendLPF.connect(this.__blendHPF.inputA);
    this.__filterHPF.connect(this.__blendHPF.inputB);
    this.__blendHPF.connect(this.__gainOutput);
  }
}
