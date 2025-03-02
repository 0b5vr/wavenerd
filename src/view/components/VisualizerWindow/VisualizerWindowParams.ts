export interface VisualizerWindowParams {
  mode: 'vectorscope' | 'oscilloscope' | 'spectrum';
  color: { r: number; g: number; b: number };
  opacity: number;
  vectorscope: {
    mode: 'points' | 'line';
    scale: number;
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
