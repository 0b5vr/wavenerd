import { Visualizer } from '../../visualizers/Visualizer';
import { VisualizerWindowParams } from './VisualizerWindowParams';
import { VisualizerWindowRequestData } from './VisualizerWindowRequestData';
import { visualizerWindowDefaultParams } from './visualizerWindowDefaultParams';

let params = structuredClone(visualizerWindowDefaultParams);
let visualizer: Visualizer | null = null;

self.onmessage = (event: MessageEvent<VisualizerWindowRequestData>) => {
  const message = event.data;

  if (message.type === 'init') {
    handleInit(message);
  } else if (message.type === 'setParams') {
    handleSetParams(message);
  } else if (message.type === 'updateVectorscope') {
    handleUpdateVectorscope(message);
  } else if (message.type === 'updateOscilloscope') {
    handleUpdateOscilloscope(message);
  } else if (message.type === 'updateSpectrum') {
    handleUpdateSpectrum(message);
  } else if (message.type === 'updateWaveform') {
    handleUpdateWaveform(message);
  } else if (message.type === 'resize') {
    handleResize(message);
  } else if (message.type === 'dispose') {
    handleDispose();
  }
};

function handleInit(message: VisualizerWindowRequestData & { type: 'init' }): void {
  const { canvas } = message;

  visualizer = new Visualizer(canvas as unknown as HTMLCanvasElement);
  setParams(params);
}

function handleUpdateVectorscope(message: VisualizerWindowRequestData & { type: 'updateVectorscope' }): void {
  if (!visualizer) return;

  const {
    timeDomainL,
    timeDomainR,
  } = message;

  visualizer.clear();

  visualizer.vectorscope.setData(timeDomainL, timeDomainR);
  visualizer.vectorscope.render();
}

function handleUpdateOscilloscope(message: VisualizerWindowRequestData & { type: 'updateOscilloscope' }): void {
  if (!visualizer) return;

  const {
    timeDomainL,
    timeDomainLoL,
    convolverBufferLength,
  } = message;

  visualizer.clear();

  visualizer.oscilloscope.setData(timeDomainL);
  visualizer.oscilloscope.calcZeroCrossing(timeDomainLoL, convolverBufferLength);
  visualizer.oscilloscope.render();
}

function handleUpdateSpectrum(message: VisualizerWindowRequestData & { type: 'updateSpectrum' }): void {
  if (!visualizer) return;

  const {
    frequencyL,
  } = message;

  visualizer.clear();

  visualizer.spectrum.setData(frequencyL);
  visualizer.spectrum.render();
}

function handleUpdateWaveform(message: VisualizerWindowRequestData & { type: 'updateWaveform' }): void {
  if (!visualizer) return;

  const {
    timeDomainL,
  } = message;

  visualizer.clear();

  visualizer.waveform.setData(timeDomainL);
  visualizer.waveform.render();
}

function setParams(params: VisualizerWindowParams): void {
  if (!visualizer) return;

  const color: [number, number, number, number] = [
    params.color.r,
    params.color.g,
    params.color.b,
    params.opacity,
  ];

  visualizer.vectorscope.mode = params.vectorscope.mode;
  visualizer.vectorscope.color = color;
  visualizer.vectorscope.scale = params.vectorscope.scale;
  visualizer.vectorscope.pointSize = params.vectorscope.pointSize;
  visualizer.vectorscope.pointShape = params.vectorscope.pointShape;

  visualizer.oscilloscope.mode = 'line';
  visualizer.oscilloscope.color = color;
  visualizer.oscilloscope.scale = params.oscilloscope.scale;

  visualizer.spectrum.mode = 'line';
  visualizer.spectrum.color = color;
  visualizer.spectrum.scale = params.spectrum.scale;

  visualizer.waveform.mode = 'line';
  visualizer.waveform.color = color;
  visualizer.waveform.windowWidth = params.waveform.width;
  visualizer.waveform.scale = params.waveform.scale;
}

function handleSetParams(message: VisualizerWindowRequestData & { type: 'setParams' }): void {
  if (!visualizer) return;

  params = message.params;
  setParams(params);
}

function handleResize(message: VisualizerWindowRequestData & { type: 'resize' }): void {
  if (!visualizer) return;

  const { width, height } = message;
  visualizer.resize(width, height);
}

function handleDispose(): void {
  if (!visualizer) return;

  visualizer.dispose();
  visualizer = null;
}
