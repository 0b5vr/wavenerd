import { VisualizerCrispFramebuffer } from './VisualizerCrispFramebuffer';
import { VisualizerOscilloscope } from './VisualizerOscilloscope';
import { VisualizerSpectrum } from './VisualizerSpectrum';
import { VisualizerVectorscope } from './VisualizerVectorscope';
import { VisualizerWaveform } from './VisualizerWaveform';

export class Visualizer {
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;

  public readonly crispFramebuffer: VisualizerCrispFramebuffer;
  public readonly vectorscope: VisualizerVectorscope;
  public readonly spectrum: VisualizerSpectrum;
  public readonly oscilloscope: VisualizerOscilloscope;
  public readonly waveform: VisualizerWaveform;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = this.gl = canvas.getContext('webgl2')!;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.blendEquation(gl.MAX);
    gl.getExtension('EXT_color_buffer_float');

    this.crispFramebuffer = new VisualizerCrispFramebuffer(gl);
    this.vectorscope = new VisualizerVectorscope(gl);
    this.spectrum = new VisualizerSpectrum(gl);
    this.oscilloscope = new VisualizerOscilloscope(gl);
    this.waveform = new VisualizerWaveform(gl);
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
