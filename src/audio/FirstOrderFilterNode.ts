import processorUrl from './FirstOrderFilterProcessor.js?url';

type FilterType = 'lowpass' | 'highpass';

export class FirstOrderFilterNode extends AudioWorkletNode {
  public readonly frequency: AudioParam;

  private _type: FilterType;

  public get type(): FilterType {
    return this._type;
  }

  public set type(value: FilterType) {
    this._type = value;
    this.port.postMessage({ type: 'setType', value });
  }

  public static addModule(audio: AudioContext): Promise<void> {
    return audio.audioWorklet.addModule(processorUrl);
  }

  constructor(audio: AudioContext) {
    super(audio, 'first-order-filter-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: {
        frequency: 350,
      },
      processorOptions: {
        sampleRate: audio.sampleRate,
      },
    });

    this.frequency = this.parameters.get('frequency')!;

    this._type = 'lowpass';
  }
}
