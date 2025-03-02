import { VisualizerWindowParams } from './VisualizerWindowParams';

export const visualizerWindowDefaultParams: VisualizerWindowParams = {
  mode: 'vectorscope',
  color: { r: 1.0, g: 1.0, b: 1.0 },
  opacity: 1.0,
  vectorscope: {
    mode: 'points',
    scale: 1.0,
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
