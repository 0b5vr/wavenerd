import { Analyser } from '../../../audio/Analyser';
import { Visualizer } from '../../visualizers/Visualizer';

export class VisualizerWindowRenderer {
  public mode: 'vectorscope' | 'oscilloscope' | 'spectrum';
  public readonly window: Window;
  public readonly canvas: HTMLCanvasElement;
  public readonly analyser: Analyser;
  public readonly visualizer: Visualizer;

  constructor(window: Window, canvas: HTMLCanvasElement, analyser: Analyser) {
    this.mode = 'vectorscope';
    this.window = window;
    this.canvas = canvas;
    this.analyser = analyser;
    this.visualizer = new Visualizer(canvas);

    this.visualizer.vectorscope.mode = 'points';
    this.visualizer.oscilloscope.mode = 'line';
    this.visualizer.spectrum.mode = 'line';
  }

  public update() {
    const { mode, visualizer, analyser } = this;
    const { timeDomainL, timeDomainR, frequencyL, timeDomainLoL, convolverBufferLength } = analyser;

    visualizer.clear();

    if (mode === 'vectorscope') {
      visualizer.vectorscope.setData(timeDomainL, timeDomainR);
      visualizer.vectorscope.render();
    } else if (mode === 'oscilloscope') {
      visualizer.oscilloscope.setData(timeDomainL);
      visualizer.oscilloscope.calcZeroCrossing(timeDomainLoL, convolverBufferLength);
      visualizer.oscilloscope.render();
    } else if (mode === 'spectrum') {
      visualizer.spectrum.setData(frequencyL);
      visualizer.spectrum.render();
    }
  }
}
