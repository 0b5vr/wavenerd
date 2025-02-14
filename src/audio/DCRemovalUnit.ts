import { DCRemovalNode } from './DCRemovalNode';

export class DCRemovalUnit {
  private __active = true;
  public get active(): boolean {
    return this.__active;
  }

  public set active(value: boolean) {
    this.__active = value;
    this.__reconnect();
  }

  private __gainInput: GainNode;
  public get input(): AudioNode {
    return this.__gainInput;
  }

  private __gainOutput: GainNode;
  public get output(): AudioNode {
    return this.__gainOutput;
  }

  private __dcRemovalNode: DCRemovalNode;

  public constructor(audio: AudioContext) {
    this.__gainInput = audio.createGain();
    this.__gainOutput = audio.createGain();
    this.__dcRemovalNode = new DCRemovalNode(audio);

    this.__reconnect();
  }

  private __reconnect(): void {
    this.__gainInput.disconnect();
    this.__dcRemovalNode.disconnect();

    if (this.__active) {
      this.__gainInput.connect(this.__dcRemovalNode);
      this.__dcRemovalNode.connect(this.__gainOutput);
    } else {
      this.__gainInput.connect(this.__gainOutput);
    }
  }
}
