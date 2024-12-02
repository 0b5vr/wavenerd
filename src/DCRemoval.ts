export class DCRemoval {
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

  private __filter: BiquadFilterNode;

  public constructor(audio: AudioContext) {
    this.__gainInput = audio.createGain();
    this.__gainOutput = audio.createGain();

    this.__filter = audio.createBiquadFilter();
    this.__filter.type = 'highpass';
    this.__filter.frequency.value = 5.0;

    this.__reconnect();
  }

  private __reconnect(): void {
    this.__gainInput.disconnect();
    this.__filter.disconnect();

    if (this.__active) {
      this.__gainInput.connect(this.__filter);
      this.__filter.connect(this.__gainOutput);
    } else {
      this.__gainInput.connect(this.__gainOutput);
    }
  }
}
