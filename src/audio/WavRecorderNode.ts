import processorUrl from './WavRecorderProcessor.js?url';

export class WavRecorderNode extends AudioWorkletNode {
  public static addModule(audio: AudioContext): Promise<void> {
    return audio.audioWorklet.addModule(processorUrl);
  }

  private __chunks: [Float32Array[], Float32Array[]] | null = [[], []];

  public constructor(audio: AudioContext) {
    super(audio, 'wav-recorder-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 2,
      channelCountMode: 'explicit',
    });

    this.port.onmessage = ({ data }) => {
      if (this.__chunks == null) {
        return;
      }

      if (data.type === 'chunk') {
        this.__chunks[0].push(data.l as Float32Array);
        this.__chunks[1].push(data.r as Float32Array);
      }
    };
  }

  public stop(): [Float32Array, Float32Array] {
    if (this.__chunks == null) {
      throw new Error('WavRecorderNode is already stopped.');
    }

    const chunks = this.__chunks;
    this.__chunks = null;
    this.port.postMessage({ type: 'stop' });

    const totalSamples = chunks[0].reduce((sum, c) => sum + c.length, 0);
    const l = new Float32Array(totalSamples);
    const r = new Float32Array(totalSamples);
    let offset = 0;
    for (let i = 0; i < chunks[0].length; i++) {
      l.set(chunks[0][i], offset);
      r.set(chunks[1][i], offset);
      offset += chunks[0][i].length;
    }
    return [l, r];
  }
}
