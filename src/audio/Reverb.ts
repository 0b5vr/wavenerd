import { LINEAR_RAMP_TIME } from './constants';
import reverbIRAllpass from './assets/reverb-ir-allpass.wav?url';

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

  private async __loadIR(): Promise<void> {
    const audio = this.__audio;

    const res = await fetch(reverbIRAllpass);
    const ab = await res.arrayBuffer();
    const buffer = await audio.decodeAudioData(ab);
    this.__convolver.buffer = buffer;
  }

  public constructor(audio: AudioContext) {
    super(audio);

    this.__audio = audio;

    this.__input = audio.createGain();
    this.__dryGain = audio.createGain();
    this.__wetGain = audio.createGain();
    this.__convolver = audio.createConvolver();

    this.__wetGain.gain.value = 0.0;

    this.__loadIR();

    this.__input.connect(this.__dryGain);
    this.__input.connect(this.__convolver);
    this.__convolver.connect(this.__wetGain);
    this.__dryGain.connect(this);
    this.__wetGain.connect(this);
  }
}
