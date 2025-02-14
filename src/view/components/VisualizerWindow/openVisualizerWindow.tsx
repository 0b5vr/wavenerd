import { createRoot } from 'react-dom/client';
import { VisualizerWindow } from './VisualizerWindow';
import { Analyser } from '../../../audio/Analyser';

export function openVisualizerWindow(analyser: Analyser) {
  const visualizerWindow = window.open('about:blank', '_blank');
  if (visualizerWindow == null) {
    throw new Error('Failed to open visualizer window');
  }

  visualizerWindow.document.body.style.margin = '0';
  visualizerWindow.document.body.style.background = '#000';

  const rootEl = visualizerWindow.document.createElement('div');
  rootEl.style.width = '100%';
  rootEl.style.height = '100%';

  const root = createRoot(rootEl);
  visualizerWindow.document.body.appendChild(rootEl);

  root.render(<VisualizerWindow analyser={analyser} />);
}
