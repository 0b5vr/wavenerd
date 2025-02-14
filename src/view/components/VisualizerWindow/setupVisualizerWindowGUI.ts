import { Pane } from 'tweakpane';
import { VisualizerWindowRenderer } from './VisualizerWindowRenderer';

/**
 * tweakpane style element is not loaded into the visualizer window
 * so we need to copy it from the main window
 */
function injectStyle(visualizerWindow: Window): void {
  const existingGuiStyleEl = document.querySelector('style[data-tp-style]');
  if (existingGuiStyleEl == null) {
    throw new Error('Unreachable. tweakpane style element not found');
  }

  const guiStyleEl = visualizerWindow.document.createElement('style');
  guiStyleEl.textContent = existingGuiStyleEl.textContent;
  visualizerWindow.document.head.appendChild(guiStyleEl);
}

/**
 * Let the element show only when the mouse is over the window
 */
function showOnMouseOver(window: Window, element: HTMLElement): void {
  window.document.body.addEventListener('mouseenter', () => {
    element.style.display = 'var(--display-enter)';
  });

  window.document.body.addEventListener('mouseleave', () => {
    element.style.display = 'var(--display-leave)';
  });
}

interface VisualizerWindowParams {
  mode: 'vectorscope' | 'oscilloscope' | 'spectrum';
  color: { r: number; g: number; b: number };
  opacity: number;
  vectorscope: {
    mode: 'points' | 'line';
    pointSize: number;
    pointShape: number;
  };
  oscilloscope: {
    scale: number;
  };
  spectrum: {
    scale: number;
  };
}

export function setupVisualizerWindowGUI(visualizerWindow: Window, renderer: VisualizerWindowRenderer): void {
  // -- hello tweakpane ----------------------------------------------------------------------------
  const pane = new Pane({
    container: visualizerWindow.document.body,
    expanded: false,
    title: 'Controls',
  });
  pane.element.id = 'pane';

  injectStyle(visualizerWindow);
  showOnMouseOver(visualizerWindow, pane.element);

  // -- init params with default values ------------------------------------------------------------
  const params: VisualizerWindowParams = {
    mode: 'vectorscope',
    color: { r: 1.0, g: 1.0, b: 1.0 },
    opacity: 1.0,
    vectorscope: {
      mode: 'points',
      pointSize: 4.0,
      pointShape: 0.0,
    },
    oscilloscope: {
      scale: 0.8,
    },
    spectrum: {
      scale: 1.0,
    },
  };

  // -- setup GUI ----------------------------------------------------------------------------------
  pane.addBinding(params, 'mode', {
    label: 'Mode',
    options: {
      'Vectorscope': 'vectorscope',
      'Oscilloscope': 'oscilloscope',
      'Spectrum': 'spectrum',
    },
  }).on('change', ({ value }) => {
    renderer.mode = value;
  });

  const applyColor = () => {
    const color = [params.color.r, params.color.g, params.color.b, params.opacity] as [number, number, number, number];

    renderer.visualizer.vectorscope.color = color;
    renderer.visualizer.oscilloscope.color = color;
    renderer.visualizer.spectrum.color = color;
  };

  pane.addBinding(params, 'color', {
    label: 'Color',
    color: { type: 'float' },
  }).on('change', applyColor);

  pane.addBinding(params, 'opacity', {
    label: 'Opacity',
    min: 0.0,
    max: 1.0,
  }).on('change', applyColor);

  const vectorscopeFolder = pane.addFolder({
    title: 'Vectorscope',
    expanded: false,
  });

  vectorscopeFolder.addBinding(params.vectorscope, 'mode', {
    label: 'Mode',
    options: {
      'Points': 'points',
      'Line': 'line',
    },
  }).on('change', () => {
    renderer.visualizer.vectorscope.mode = params.vectorscope.mode;
  });

  vectorscopeFolder.addBinding(params.vectorscope, 'pointSize', {
    label: 'Point Size',
    min: 1.0,
    max: 16.0,
  }).on('change', () => {
    renderer.visualizer.vectorscope.pointSize = params.vectorscope.pointSize;
  });

  vectorscopeFolder.addBinding(params.vectorscope, 'pointShape', {
    label: 'Point Shape',
    min: 0.0,
    max: 1.0,
  }).on('change', () => {
    renderer.visualizer.vectorscope.pointShape = params.vectorscope.pointShape;
  });

  const oscilloscopeFolder = pane.addFolder({
    title: 'Oscilloscope',
    expanded: false,
  }).on('change', () => {
    renderer.visualizer.oscilloscope.scale = params.oscilloscope.scale;
  });

  oscilloscopeFolder.addBinding(params.oscilloscope, 'scale', {
    label: 'Scale',
    min: 0.0,
    max: 1.0,
  }).on('change', () => {
    renderer.visualizer.oscilloscope.scale = params.oscilloscope.scale;
  });

  const spectrumFolder = pane.addFolder({
    title: 'Spectrum',
    expanded: false,
  }).on('change', () => {
    renderer.visualizer.spectrum.scale = params.spectrum.scale;
  });

  spectrumFolder.addBinding(params.spectrum, 'scale', {
    label: 'Scale',
    min: 0.0,
    max: 1.0,
  }).on('change', () => {
    renderer.visualizer.spectrum.scale = params.spectrum.scale;
  });

  pane.addBlade({ view: 'separator' });

  pane.addButton({
    title: 'Fullscreen',
  }).on('click', () => {
    visualizerWindow.document.body.requestFullscreen();
  });
}
