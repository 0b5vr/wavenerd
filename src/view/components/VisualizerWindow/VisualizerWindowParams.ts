export interface VisualizerWindowParams {
  mode: 'vectorscope' | 'oscilloscope' | 'spectrum' | 'waveform';
  color: { r: number; g: number; b: number };
  opacity: number;
  vectorscope: {
    mode: 'points' | 'crisp-points' | 'line' | 'crisp-line';
    scale: number;
    pointSize: number;
    pointShape: number;
  };
  oscilloscope: {
    mode: 'line' | 'crisp-line';
    scale: number;
  };
  spectrum: {
    mode: 'line' | 'crisp-line';
    scale: number;
  };
  waveform: {
    mode: 'line' | 'crisp-line';
    width: number;
    scale: number;
  };
}
