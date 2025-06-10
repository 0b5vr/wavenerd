import { Analyser } from '../../../audio/Analyser';
import { VisualizerOscilloscope } from '../../visualizers/VisualizerOscilloscope';
import { VisualizerSpectrum } from '../../visualizers/VisualizerSpectrum';
import { VisualizerVectorscope } from '../../visualizers/VisualizerVectorscope';
import { VisualizerWaveform } from '../../visualizers/VisualizerWaveform';

export class DeckWindowProxy {
  private canvas: HTMLCanvasElement;
  private analyser: Analyser;
  private editorContainer: HTMLElement;
  private initialCode: string;
  private visualizer: VisualizerOscilloscope | VisualizerSpectrum | VisualizerVectorscope | VisualizerWaveform;
  private currentVisualizerType: 'oscilloscope' | 'spectrum' | 'vectorscope' | 'waveform' = 'oscilloscope';

  constructor(canvas: HTMLCanvasElement, analyser: Analyser, editorContainer: HTMLElement, initialCode: string) {
    this.canvas = canvas;
    this.analyser = analyser;
    this.editorContainer = editorContainer;
    this.initialCode = initialCode;

    this.setupCanvas();
    this.setupEditor();
    this.setupVisualizer();
  }

  private setupCanvas(): void {
    this.canvas.width = 600;
    this.canvas.height = 400;
  }

  private setupEditor(): void {
    // Create a simple textarea for now - in a real implementation,
    // you'd want to integrate with CodeMirror
    const textarea = document.createElement('textarea');
    textarea.value = this.initialCode;
    textarea.style.width = '100%';
    textarea.style.height = '400px';
    textarea.style.fontFamily = 'monospace';
    textarea.style.fontSize = '14px';
    textarea.style.backgroundColor = '#1e1e1e';
    textarea.style.color = '#d4d4d4';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.padding = '16px';
    textarea.style.resize = 'none';
    
    this.editorContainer.appendChild(textarea);
  }

  private setupVisualizer(): void {
    const gl = this.canvas.getContext('webgl2');
    if (gl == null) {
      throw new Error('WebGL2 is not supported');
    }

    this.visualizer = new VisualizerOscilloscope(gl);
  }

  public resize(width: number, height: number): void {
    // Resize canvas to fit the window
    const canvasWidth = Math.max(400, width - 40);
    const canvasHeight = Math.max(300, height - 460); // Leave space for editor
    
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.width = `${canvasWidth}px`;
    this.canvas.style.height = `${canvasHeight}px`;
  }

  public update(): void {
    if (this.visualizer) {
      this.visualizer.update(this.analyser);
    }
  }

  public setVisualizerType(type: 'oscilloscope' | 'spectrum' | 'vectorscope' | 'waveform'): void {
    if (this.currentVisualizerType === type) {
      return;
    }

    const gl = this.canvas.getContext('webgl2');
    if (gl == null) {
      return;
    }

    this.visualizer.dispose();

    switch (type) {
      case 'oscilloscope':
        this.visualizer = new VisualizerOscilloscope(gl);
        break;
      case 'spectrum':
        this.visualizer = new VisualizerSpectrum(gl);
        break;
      case 'vectorscope':
        this.visualizer = new VisualizerVectorscope(gl);
        break;
      case 'waveform':
        this.visualizer = new VisualizerWaveform(gl);
        break;
    }

    this.currentVisualizerType = type;
  }

  public dispose(): void {
    if (this.visualizer) {
      this.visualizer.dispose();
    }
  }
}