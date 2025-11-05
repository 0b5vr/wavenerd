import { HardClipNode } from './HardClipNode';

export class MasterLimiterHardClip {
  private __gainInput: GainNode;
  public get input(): AudioNode {
    return this.__gainInput;
  }

  private __gainOutput: GainNode;
  public get output(): AudioNode {
    return this.__gainOutput;
  }

  private __limiterNode: HardClipNode;

  public constructor(audio: AudioContext) {
    this.__gainInput = audio.createGain();
    this.__gainOutput = audio.createGain();
    this.__limiterNode = new HardClipNode(audio);

    this.__gainInput.connect(this.__limiterNode);
    this.__limiterNode.connect(this.__gainOutput);
  }
}
