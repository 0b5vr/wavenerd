import processorUrl from './TimeDomainDataProbeProcessor.js?url';

const BLOCK_SIZE = 128;

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

  public readonly dataSize: number;
  public data: Float32Array;

  constructor(audio: AudioContext, dataSize: number) {
    super(audio, 'time-domain-data-probe-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });

    this.dataSize = dataSize;
    this.data = new Float32Array(dataSize);

    this.port.onmessage = (event) => this.handleMessage(event);
  }

  private handleMessage(event: MessageEvent): void {
    const { dataSize, data } = this;

    const newData = event.data as Float32Array;

    // slide the data
    data.set(data.slice(BLOCK_SIZE), 0);

    // add the new data
    data.set(newData, dataSize - BLOCK_SIZE);
  }
}
