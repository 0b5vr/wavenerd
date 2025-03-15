import { lerp, linearstep } from '@0b5vr/experimental';
import { MixerFilter } from './MixerFilter';
import { FirstOrderFilterNode } from './FirstOrderFilterNode';
import { BlendNode } from './BlendNode';
import { LINEAR_RAMP_TIME } from './constants';

const LOG2_MIN_FREQ = Math.log2(20.0);
const LOG2_MAX_FREQ = Math.log2(20000.0);

export class MixerFilterGate extends MixerFilter {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private readonly __gainInput: GainNode;
  private readonly __gainOutput: GainNode;

  private readonly __blendLPF: BlendNode;
  private readonly __blendHPF: BlendNode;

  private readonly __filterLPF: FirstOrderFilterNode;
  private readonly __filterHPF: FirstOrderFilterNode;

  private __value: number;

  public get filter(): number {
    return this.__value;
  }

  public set filter(value: number) {
    this.__value = value;

    const time = this.__audio.currentTime + LINEAR_RAMP_TIME;

    const lpfWet = linearstep(0.5, 0.45, value);
    this.__blendLPF.blend = lpfWet;

    const lpfFreq = Math.pow(2.0, lerp(LOG2_MIN_FREQ, LOG2_MAX_FREQ, linearstep(0.0, 0.5, value)));
    this.__filterLPF.frequency.linearRampToValueAtTime(lpfFreq, time);

    const lpfGain = Math.sqrt(linearstep(0.0, 0.5, value));
    this.__blendLPF.gain.linearRampToValueAtTime(lpfGain, time);

    const hpfWet = linearstep(0.5, 0.55, value);
    this.__blendHPF.blend = hpfWet;

    const hpfFreq = Math.pow(2.0, lerp(LOG2_MIN_FREQ, LOG2_MAX_FREQ, linearstep(0.5, 1.0, value)));
    this.__filterHPF.frequency.linearRampToValueAtTime(hpfFreq, time);

    const hpfGain = Math.sqrt(linearstep(1.0, 0.5, value));
    this.__blendHPF.gain.linearRampToValueAtTime(hpfGain, time);

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

    this.__filterLPF = new FirstOrderFilterNode(audio);
    this.__filterLPF.type = 'lowpass';
    this.__filterHPF = new FirstOrderFilterNode(audio);
    this.__filterHPF.type = 'highpass';

    this.__value = 0.5;
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
