import { ANALYSER_FREQUENCY_SIZE, ANALYSER_LO_FREQUENCY, ANALYSER_TIME_DOMAIN_SIZE } from './constants';
import { createCrossoverIR } from './createCrossoverIR';
import { TimeDomainDataProbeNode } from './TimeDomainDataProbeNode';

export class Analyser {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __inputNode: AudioNode;
  private __splitterNode: ChannelSplitterNode;
  private __analyserNodeL: AnalyserNode;
  private __probeNode: TimeDomainDataProbeNode;
  private __convolverLoL: ConvolverNode;
  private __probeNodeLoL: TimeDomainDataProbeNode;

  public get input(): AudioNode {
    return this.__inputNode;
  }

  public get timeDomainL(): Float32Array {
    return this.__probeNode.data[0];
  }

  public get timeDomainR(): Float32Array {
    return this.__probeNode.data[1];
  }

  public get timeDomainLoL(): Float32Array {
    return this.__probeNodeLoL.data[0];
  }

  public frequencyL: Float32Array<ArrayBuffer>;

  public get convolverBufferLength(): number {
    return this.__convolverLoL.buffer!.length;
  }

  public constructor(audio: AudioContext) {
    this.__audio = audio;

    this.__inputNode = audio.createGain();
    this.__splitterNode = audio.createChannelSplitter(2);
    this.__analyserNodeL = audio.createAnalyser();
    this.__probeNode = new TimeDomainDataProbeNode(audio, 2, ANALYSER_TIME_DOMAIN_SIZE);
    this.__convolverLoL = audio.createConvolver();
    this.__probeNodeLoL = new TimeDomainDataProbeNode(audio, 1, ANALYSER_TIME_DOMAIN_SIZE);

    this.__analyserNodeL.fftSize = 4096;

    this.__convolverLoL.normalize = false;
    this.__convolverLoL.buffer = createCrossoverIR({
      sampleRate: audio.sampleRate,
      lpfFreq: ANALYSER_LO_FREQUENCY,
    });

    this.__inputNode.connect(this.__splitterNode);
    this.__splitterNode.connect(this.__analyserNodeL, 0);
    this.__inputNode.connect(this.__probeNode);
    this.__splitterNode.connect(this.__convolverLoL, 0);
    this.__convolverLoL.connect(this.__probeNodeLoL);

    this.frequencyL = new Float32Array(ANALYSER_FREQUENCY_SIZE);
  }

  public update(): void {
    this.__probeNode.update();
    this.__probeNodeLoL.update();
    this.__analyserNodeL.getFloatFrequencyData(this.frequencyL);
  }
}
