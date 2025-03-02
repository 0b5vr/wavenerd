import { Analyser } from '../../../audio/Analyser';
import VisualizerWindowWorker from './VisualizerWindowWorker.worker.ts?worker';
import { VisualizerWindowParams } from './VisualizerWindowParams';
import { VisualizerWindowRequestData } from './VisualizerWindowRequestData';
import { visualizerWindowDefaultParams } from './visualizerWindowDefaultParams';

export class VisualizerWindowProxy {
  public params: VisualizerWindowParams;
  public readonly canvas: HTMLCanvasElement;
  public readonly analyser: Analyser;
  private readonly worker: Worker;

  constructor(canvas: HTMLCanvasElement, analyser: Analyser) {
    this.params = structuredClone(visualizerWindowDefaultParams);
    this.canvas = canvas;
    this.analyser = analyser;

    this.worker = new VisualizerWindowWorker();

    const offscreenCanvas = canvas.transferControlToOffscreen();
    this.__sendMessage({
      type: 'init',
      canvas: offscreenCanvas,
    }, [offscreenCanvas]);
  }

  public update() {
    const { analyser } = this;

    if (this.params.mode === 'vectorscope') {
      const { timeDomainL, timeDomainR } = analyser;

      const timeDomainLCopy = new Float32Array(timeDomainL);
      const timeDomainRCopy = new Float32Array(timeDomainR);

      this.__sendMessage({
        type: 'updateVectorscope',
        timeDomainL: timeDomainLCopy,
        timeDomainR: timeDomainRCopy,
      }, [
        timeDomainLCopy.buffer,
        timeDomainRCopy.buffer,
      ]);
    } else if (this.params.mode === 'oscilloscope') {
      const { timeDomainL, timeDomainLoL, convolverBufferLength } = analyser;

      const timeDomainLCopy = new Float32Array(timeDomainL);
      const timeDomainLoLCopy = new Float32Array(timeDomainLoL);

      this.__sendMessage({
        type: 'updateOscilloscope',
        timeDomainL: timeDomainLCopy,
        timeDomainLoL: timeDomainLoLCopy,
        convolverBufferLength,
      }, [
        timeDomainLCopy.buffer,
        timeDomainLoLCopy.buffer,
      ]);
    } else if (this.params.mode === 'spectrum') {
      const { frequencyL } = analyser;

      const frequencyLCopy = new Float32Array(frequencyL);

      this.__sendMessage({
        type: 'updateSpectrum',
        frequencyL: frequencyLCopy,
      }, [
        frequencyLCopy.buffer,
      ]);
    } else if (this.params.mode === 'waveform') {
      const { timeDomainL } = analyser;

      const timeDomainLCopy = new Float32Array(timeDomainL);

      this.__sendMessage({
        type: 'updateWaveform',
        timeDomainL: timeDomainLCopy,
      }, [
        timeDomainLCopy.buffer,
      ]);
    }
  }

  public resize(width: number, height: number) {
    this.__sendMessage({
      type: 'resize',
      width,
      height,
    });
  }

  public dispose() {
    this.__sendMessage({
      type: 'dispose',
    });
    this.worker.terminate();
  }

  /**
   * Set visualization parameters.
   *
   * @param params The parameters
   */
  public setParams(params: VisualizerWindowParams) {
    this.params = params;
    this.__sendMessage({
      type: 'setParams',
      params,
    });
  }

  private __sendMessage(data: VisualizerWindowRequestData, transfer?: Transferable[]) {
    this.worker.postMessage(data, { transfer });
  }
}
