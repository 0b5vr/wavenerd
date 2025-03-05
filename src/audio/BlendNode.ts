import { LINEAR_RAMP_TIME } from './constants';

export class BlendNode extends GainNode {
  public readonly inputA: GainNode;
  public readonly inputB: GainNode;

  public get blend(): number {
    return this.inputA.gain.value;
  }

  public set blend(value: number) {
    const time = this.context.currentTime + LINEAR_RAMP_TIME;

    this.inputA.gain.linearRampToValueAtTime(1.0 - value, time);
    this.inputB.gain.linearRampToValueAtTime(value, time);
  }

  public constructor(context: AudioContext) {
    super(context);

    this.inputA = context.createGain();
    this.inputB = context.createGain();

    this.inputA.connect(this);
    this.inputB.connect(this);
  }
}
