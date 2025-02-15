import style from './style.css';
import { Analyser } from '../../../audio/Analyser';
import { VisualizerWindowRenderer } from './VisualizerWindowRenderer';
import { setupVisualizerWindowGUI } from './setupVisualizerWindowGUI';

export function openVisualizerWindow(analyser: Analyser): void {
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

  const update = () => {
    if (visualizerWindow.closed) {
      console.log('visualizerWindow closed');
      return;
    }

    requestAnimationFrame(update);

    renderer.update();
  };
  requestAnimationFrame(update);
}
