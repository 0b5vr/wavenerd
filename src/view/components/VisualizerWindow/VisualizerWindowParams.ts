export interface VisualizerWindowParams {
  mode: 'vectorscope' | 'oscilloscope' | 'spectrum' | 'waveform';
  color: { r: number; g: number; b: number };
  opacity: number;
  vectorscope: {
    mode: 'points' | 'line' | 'crispline';
    scale: number;
    pointSize: number;
    pointShape: number;
  };
  oscilloscope: {
    mode: 'line' | 'crispline';
    scale: number;
  };
  spectrum: {
    mode: 'line' | 'crispline';
    scale: number;
  };
  waveform: {
    mode: 'line' | 'crispline';
    width: number;
    scale: number;
  };
}
