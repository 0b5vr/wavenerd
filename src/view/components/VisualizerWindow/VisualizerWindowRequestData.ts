import { VisualizerWindowParams } from './VisualizerWindowParams';

export type VisualizerWindowRequestData = (
  | { type: 'init'; canvas: OffscreenCanvas }
  | { type: 'setParams'; params: VisualizerWindowParams }
  | { type: 'updateVectorscope'; timeDomainL: Float32Array; timeDomainR: Float32Array }
  | { type: 'updateOscilloscope'; timeDomainL: Float32Array; timeDomainLoL: Float32Array; convolverBufferLength: number }
  | { type: 'updateSpectrum'; frequencyL: Float32Array }
  | { type: 'resize'; width: number; height: number }
  | { type: 'dispose' }
  | { type: '__heck' } // to make type check work
);
