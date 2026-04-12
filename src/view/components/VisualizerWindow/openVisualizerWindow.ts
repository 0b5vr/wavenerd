import style from './style.css';
import { type Analyser } from '../../../audio/Analyser';
import { VisualizerWindowProxy } from './VisualizerWindowProxy';
import { setupVisualizerWindowGUI } from './setupVisualizerWindowGUI';
import { type FrameEmitter } from '../../../FrameEmitter';

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

  const proxy = new VisualizerWindowProxy(canvas, analyser);

  setupVisualizerWindowGUI(visualizerWindow, (params) => proxy.setParams(params));

  visualizerWindow.addEventListener('resize', () => {
    proxy.resize(visualizerWindow.innerWidth, visualizerWindow.innerHeight);
  });

  visualizerWindow.addEventListener('beforeunload', () => {
    proxy.dispose();
  });

  window.addEventListener('beforeunload', () => {
    visualizerWindow.close();
  });

  const update = () => {
    if (visualizerWindow.closed) {
      frameEmitter.off('update', update);
      return;
    }

    proxy.update();
  };
  frameEmitter.on('update', update);
}
