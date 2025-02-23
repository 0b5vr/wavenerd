import style from './style.css';
import { Analyser } from '../../../audio/Analyser';
import { VisualizerWindowRenderer } from './VisualizerWindowRenderer';
import { setupVisualizerWindowGUI } from './setupVisualizerWindowGUI';
import { FrameEmitter } from '../../../FrameEmitter';

export function openVisualizerWindow(analyser: Analyser, frameEmitter: FrameEmitter): void {
  const visualizerWindow = window.open('about:blank', '_blank', 'height=480,width=480');
  if (visualizerWindow == null) {
    throw new Error('Failed to open visualizer window');
  }

  visualizerWindow.document.title = 'Wavenerd';

  const styleEl = visualizerWindow.document.createElement('style');
  styleEl.textContent = style;
  visualizerWindow.document.head.appendChild(styleEl);

  const canvas = visualizerWindow.document.createElement('canvas');
  canvas.id = 'canvas';
  visualizerWindow.document.body.appendChild(canvas);

  const renderer = new VisualizerWindowRenderer(visualizerWindow, canvas, analyser);

  setupVisualizerWindowGUI(visualizerWindow, renderer);

  visualizerWindow.addEventListener('resize', () => {
    renderer.visualizer.resize(visualizerWindow.innerWidth, visualizerWindow.innerHeight);
  });

  visualizerWindow.addEventListener('beforeunload', () => {
    renderer.visualizer.dispose();
  });

  window.addEventListener('beforeunload', () => {
    visualizerWindow.close();
  });

  frameEmitter.on('update', () => {
    if (visualizerWindow.closed) {
      return;
    }

    renderer.update();
  });
}
