export interface VisualizerWindowParams {
  mode: 'vectorscope' | 'oscilloscope' | 'spectrum' | 'waveform';
  color: { r: number; g: number; b: number };
  opacity: number;
  vectorscope: {
    mode: 'points' | 'line';
    scale: number;
    pointSize: number;
    pointShape: number;
  };
  oscilloscope: {
    mode: 'line' | 'crispline';
    scale: number;
  };
  spectrum: {
    scale: number;
  };
  waveform: {
    width: number;
    scale: number;
  };
}
