import style from './style.css';
import { Analyser } from '../../../audio/Analyser';
import { DeckWindowProxy } from './DeckWindowProxy';
import { FrameEmitter } from '../../../FrameEmitter';

export function openDeckWindow(
  analyser: Analyser, 
  frameEmitter: FrameEmitter,
  deckName: string,
  initialCode: string
): void {
  const deckWindow = window.open('about:blank', '_blank', 'height=800,width=1200');
  if (deckWindow == null) {
    throw new Error('Failed to open deck window');
  }

  deckWindow.document.title = `Wavenerd - Deck ${deckName.toUpperCase()}`;

  const styleEl = deckWindow.document.createElement('style');
  styleEl.textContent = style;
  deckWindow.document.head.appendChild(styleEl);

  // Create main container
  const container = deckWindow.document.createElement('div');
  container.id = 'deck-container';
  deckWindow.document.body.appendChild(container);

  // Create editor container
  const editorContainer = deckWindow.document.createElement('div');
  editorContainer.id = 'editor-container';
  container.appendChild(editorContainer);

  // Create visualizer canvas
  const canvas = deckWindow.document.createElement('canvas');
  canvas.id = 'visualizer-canvas';
  container.appendChild(canvas);

  const proxy = new DeckWindowProxy(canvas, analyser, editorContainer, initialCode);

  deckWindow.addEventListener('resize', () => {
    proxy.resize(deckWindow.innerWidth, deckWindow.innerHeight);
  });

  deckWindow.addEventListener('beforeunload', () => {
    proxy.dispose();
  });

  window.addEventListener('beforeunload', () => {
    deckWindow.close();
  });

  const update = () => {
    if (deckWindow.closed) {
      frameEmitter.off('update', update);
      return;
    }

    proxy.update();
  };
  frameEmitter.on('update', update);
}