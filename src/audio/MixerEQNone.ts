import { MixerEQ } from './MixerEQ';

export class MixerEQNone extends MixerEQ {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __low = 1.0;
  public get low(): number {
    return this.__low;
  }

  public set low(value: number) {
    this.__low = value;
    this.__emit('change', { low: value });
  }

  private __mid = 1.0;
  public get mid(): number {
    return this.__mid;
  }

  public set mid(value: number) {
    this.__mid = value;
    this.__emit('change', { mid: value });
  }

  private __high = 1.0;
  public get high(): number {
    return this.__high;
  }

  public set high(value: number) {
    this.__high = value;
    this.__emit('change', { high: value });
  }

  private __gainNode: GainNode;
  private __gainNodeOut: GainNode;

  public get input(): AudioNode {
    return this.__gainNode;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  public constructor(audio: AudioContext) {
    super();

    this.__audio = audio;

    this.__gainNode = audio.createGain();
    this.__gainNodeOut = audio.createGain();

    this.__gainNode.connect(this.__gainNodeOut);
  }
}
