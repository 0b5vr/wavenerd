import { MixerFilter } from './MixerFilter';

export class MixerFilterNone extends MixerFilter {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __filter = 0.5;
  public get filter(): number {
    return this.__filter;
  }

  public set filter(value: number) {
    this.__filter = value;
    this.__emit('change', { filter: value });
  }

  private __gainNode: GainNode;
  private __gainNodeOut: GainNode;

  public get input(): AudioNode {
    return this.__gainNode;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  constructor(audio: AudioContext) {
    super();

    this.__audio = audio;

    this.__gainNode = audio.createGain();
    this.__gainNodeOut = audio.createGain();

    this.__gainNode.connect(this.__gainNodeOut);
  }
}
