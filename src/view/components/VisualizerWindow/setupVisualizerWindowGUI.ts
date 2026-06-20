import { Pane } from 'tweakpane';
import { type VisualizerWindowParams } from './VisualizerWindowParams';
import { visualizerWindowDefaultParams } from './visualizerWindowDefaultParams';
import { ANALYSER_TIME_DOMAIN_SIZE } from '../../../audio/constants';

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
    element.style.opacity = '1.0';
  });

  window.document.body.addEventListener('mouseleave', () => {
    element.style.opacity = '0.0';
  });
}

export function setupVisualizerWindowGUI(
  visualizerWindow: Window,
  callback: (params: VisualizerWindowParams) => void,
): void {
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
  const params: VisualizerWindowParams = structuredClone(visualizerWindowDefaultParams);

  // -- setup GUI ----------------------------------------------------------------------------------
  pane.addBinding(params, 'mode', {
    label: 'Mode',
    options: {
      'Vectorscope': 'vectorscope',
      'Oscilloscope': 'oscilloscope',
      'Spectrum': 'spectrum',
      'Waveform': 'waveform',
    },
  }).on('change', () => callback(params));

  const applyColor = () => callback(params);

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
      'Crisppoints': 'crisppoints',
      'Line': 'line',
      'Crispline': 'crispline',
    },
  }).on('change', () => callback(params));

  vectorscopeFolder.addBinding(params.vectorscope, 'scale', {
    label: 'Scale',
    min: 0.0,
    max: 4.0,
  }).on('change', () => callback(params));

  vectorscopeFolder.addBinding(params.vectorscope, 'pointSize', {
    label: 'Point Size',
    min: 1.0,
    max: 16.0,
  }).on('change', () => callback(params));

  vectorscopeFolder.addBinding(params.vectorscope, 'pointShape', {
    label: 'Point Shape',
    min: 0.0,
    max: 1.0,
  }).on('change', () => callback(params));

  const oscilloscopeFolder = pane.addFolder({
    title: 'Oscilloscope',
    expanded: false,
  }).on('change', () => callback(params));

  oscilloscopeFolder.addBinding(params.oscilloscope, 'mode', {
    label: 'Mode',
    options: {
      'Line': 'line',
      'Crispline': 'crispline',
    },
  }).on('change', () => callback(params));

  oscilloscopeFolder.addBinding(params.oscilloscope, 'scale', {
    label: 'Scale',
    min: 0.0,
    max: 1.0,
  }).on('change', () => callback(params));

  const spectrumFolder = pane.addFolder({
    title: 'Spectrum',
    expanded: false,
  }).on('change', () => callback(params));

  spectrumFolder.addBinding(params.spectrum, 'mode', {
    label: 'Mode',
    options: {
      'Line': 'line',
      'Crispline': 'crispline',
    },
  }).on('change', () => callback(params));

  spectrumFolder.addBinding(params.spectrum, 'scale', {
    label: 'Scale',
    min: 0.0,
    max: 1.0,
  }).on('change', () => callback(params));

  const waveformFolder = pane.addFolder({
    title: 'Waveform',
    expanded: false,
  }).on('change', () => callback(params));

  waveformFolder.addBinding(params.waveform, 'mode', {
    label: 'Mode',
    options: {
      'Line': 'line',
      'Crispline': 'crispline',
    },
  }).on('change', () => callback(params));

  waveformFolder.addBinding(params.waveform, 'width', {
    label: 'Width',
    min: 256,
    max: ANALYSER_TIME_DOMAIN_SIZE,
    step: 1,
  }).on('change', () => callback(params));

  waveformFolder.addBinding(params.waveform, 'scale', {
    label: 'Scale',
    min: 0.0,
    max: 1.0,
  }).on('change', () => callback(params));

  pane.addBlade({ view: 'separator' });

  pane.addButton({
    title: 'Fullscreen',
  }).on('click', () => {
    visualizerWindow.document.body.requestFullscreen();
  });
}
