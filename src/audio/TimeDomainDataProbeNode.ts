import { arraySerial } from '@0b5vr/experimental';
import processorUrl from './TimeDomainDataProbeProcessor.js?url';

/**
 * AnalyserNode's timeDomain data sucks!
 * It doesn't give us the smooth data we need.
 *
 * This node is a workaround to get the smooth timeDomain data.
 */
export class TimeDomainDataProbeNode extends AudioWorkletNode {
  public static addModule(audio: AudioContext): Promise<void> {
    return audio.audioWorklet.addModule(processorUrl);
  }

  public readonly channelCount: number;
  public readonly dataSize: number;
  public data: Float32Array[];

  constructor(audio: AudioContext, channelCount: number, dataSize: number) {
    super(audio, 'time-domain-data-probe-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [channelCount],
    });

    this.channelCount = channelCount;
    this.dataSize = dataSize;
    this.data = arraySerial(channelCount).map(() => new Float32Array(dataSize));

    this.port.onmessage = (event) => this.__handleMessage(event);
  }

  public update(): void {
    this.port.postMessage(null);
  }

  private __handleMessage(event: MessageEvent): void {
    const { channelCount, dataSize, data } = this;

    const newData = event.data as Float32Array[];

    for (let i = 0; i < channelCount; i++) {
      const len = newData[i].length;

      // slide the data
      data[i].set(data[i].slice(len), 0);

      // add the new data
      data[i].set(newData[i], dataSize - len);
    }
  }
}
