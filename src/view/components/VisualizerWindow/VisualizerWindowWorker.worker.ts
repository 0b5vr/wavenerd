import { Visualizer } from '../../visualizers/Visualizer';
import { type VisualizerWindowParams } from './VisualizerWindowParams';
import { type VisualizerWindowRequestData } from './VisualizerWindowRequestData';
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
  visualizer.crispFramebuffer.clear();

  visualizer.vectorscope.setData(timeDomainL, timeDomainR);
  visualizer.vectorscope.render(visualizer.crispFramebuffer);

  visualizer.crispFramebuffer.blit();
}

function handleUpdateOscilloscope(message: VisualizerWindowRequestData & { type: 'updateOscilloscope' }): void {
  if (!visualizer) return;

  const {
    timeDomainL,
    timeDomainLoL,
    convolverBufferLength,
  } = message;

  visualizer.clear();
  visualizer.crispFramebuffer.clear();

  visualizer.oscilloscope.setData(timeDomainL);
  visualizer.oscilloscope.calcZeroCrossing(timeDomainLoL, convolverBufferLength);
  visualizer.oscilloscope.render(visualizer.crispFramebuffer);

  visualizer.crispFramebuffer.blit();
}

function handleUpdateSpectrum(message: VisualizerWindowRequestData & { type: 'updateSpectrum' }): void {
  if (!visualizer) return;

  const {
    frequencyL,
  } = message;

  visualizer.clear();
  visualizer.crispFramebuffer.clear();

  visualizer.spectrum.setData(frequencyL);
  visualizer.spectrum.render(visualizer.crispFramebuffer);

  visualizer.crispFramebuffer.blit();
}

function handleUpdateWaveform(message: VisualizerWindowRequestData & { type: 'updateWaveform' }): void {
  if (!visualizer) return;

  const {
    timeDomainL,
  } = message;

  visualizer.clear();
  visualizer.crispFramebuffer.clear();

  visualizer.waveform.setData(timeDomainL);
  visualizer.waveform.render(visualizer.crispFramebuffer);

  visualizer.crispFramebuffer.blit();
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

  visualizer.oscilloscope.mode = params.oscilloscope.mode;
  visualizer.oscilloscope.color = color;
  visualizer.oscilloscope.scale = params.oscilloscope.scale;

  visualizer.spectrum.mode = params.spectrum.mode;
  visualizer.spectrum.color = color;
  visualizer.spectrum.scale = params.spectrum.scale;

  visualizer.waveform.mode = params.waveform.mode;
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
