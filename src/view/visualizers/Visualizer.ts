import { VisualizerOscilloscope } from './VisualizerOscilloscope';
import { VisualizerSpectrum } from './VisualizerSpectrum';
import { VisualizerVectorscope } from './VisualizerVectorscope';
import { VisualizerWaveform } from './VisualizerWaveform';

export class Visualizer {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;

  public readonly vectorscope: VisualizerVectorscope;
  public readonly spectrum: VisualizerSpectrum;
  public readonly oscilloscope: VisualizerOscilloscope;
  public readonly waveform: VisualizerWaveform;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = this.gl = canvas.getContext('webgl2')!;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.getExtension('EXT_color_buffer_float');

    this.vectorscope = new VisualizerVectorscope(this);
    this.spectrum = new VisualizerSpectrum(this);
    this.oscilloscope = new VisualizerOscilloscope(this);
    this.waveform = new VisualizerWaveform(this);
  }

  public clear(): void {
    const { gl } = this;

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  public resize(width: number, height: number) {
    const { canvas, gl } = this;

    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }

  public dispose(): void {
    const { gl } = this;

    gl.getExtension('WEBGL_lose_context')!.loseContext();
  }
}
