import { createCrossoverIR } from './createCrossoverIR';
import { TimeDomainDataProbeNode } from './TimeDomainDataProbeNode';

export const ANALYSER_TIME_DOMAIN_SIZE = 8192;
export const ANALYSER_FREQUENCY_SIZE = 1024;
export const ANALYSER_LO_FREQUENCY = 200;

export class Analyser {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __splitterNode: ChannelSplitterNode;
  private __analyserNodeL: AnalyserNode;
  private __probeNodeL: TimeDomainDataProbeNode;
  private __probeNodeR: TimeDomainDataProbeNode;
  private __convolverLoL: ConvolverNode;
  private __probeNodeLoL: TimeDomainDataProbeNode;

  public get input(): AudioNode {
    return this.__splitterNode;
  }

  public get timeDomainL(): Float32Array {
    return this.__probeNodeL.data;
  }

  public get timeDomainR(): Float32Array {
    return this.__probeNodeR.data;
  }

  public get timeDomainLoL(): Float32Array {
    return this.__probeNodeLoL.data;
  }

  public frequencyL: Float32Array;

  public get convolverBufferLength(): number {
    return this.__convolverLoL.buffer!.length;
  }

  public constructor(audio: AudioContext) {
    this.__audio = audio;

    this.__splitterNode = audio.createChannelSplitter(2);
    this.__analyserNodeL = audio.createAnalyser();
    this.__probeNodeL = new TimeDomainDataProbeNode(audio, ANALYSER_TIME_DOMAIN_SIZE);
    this.__probeNodeR = new TimeDomainDataProbeNode(audio, ANALYSER_TIME_DOMAIN_SIZE);
    this.__convolverLoL = audio.createConvolver();
    this.__probeNodeLoL = new TimeDomainDataProbeNode(audio, ANALYSER_TIME_DOMAIN_SIZE);

    this.__analyserNodeL.fftSize = 4096;

    this.__convolverLoL.normalize = false;
    this.__convolverLoL.buffer = createCrossoverIR({
      sampleRate: audio.sampleRate,
      lpfFreq: ANALYSER_LO_FREQUENCY,
    });

    this.__splitterNode.connect(this.__analyserNodeL, 0);
    this.__splitterNode.connect(this.__probeNodeL, 0);
    this.__splitterNode.connect(this.__probeNodeR, 1);
    this.__splitterNode.connect(this.__convolverLoL, 0);
    this.__convolverLoL.connect(this.__probeNodeLoL);

    this.frequencyL = new Float32Array(ANALYSER_FREQUENCY_SIZE);
  }

  public update(): void {
    this.__analyserNodeL.getFloatFrequencyData(this.frequencyL);
  }
}
