import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { WaveRenderer } from '../../renderers/WaveRenderer';
import { Analyser } from '../../../audio/Analyser';

export function useSpectrum(renderer: WaveRenderer | undefined, analyser: Analyser): () => void {
  const spectrumMode = useSettings('spectrumMode');
  const spectrumOpacity = useSettings('spectrumOpacity');
  const spectrumColor = useSettings('spectrumColor');

  // set mode, color
  useEffect(() => {
    if (renderer == null) { return; }

    renderer.spectrum.mode = spectrumMode;

    renderer.spectrum.color = [
      parseInt(spectrumColor.slice(1, 3), 16) / 255.0,
      parseInt(spectrumColor.slice(3, 5), 16) / 255.0,
      parseInt(spectrumColor.slice(5, 7), 16) / 255.0,
      spectrumOpacity,
    ];
  }, [renderer, spectrumMode, spectrumColor, spectrumOpacity]);

  // update the renderer
  return useCallback(() => {
    if (spectrumMode !== 'none') {
      const { frequencyL } = analyser;
      renderer?.spectrum.setData(frequencyL);
      renderer?.spectrum.render();
    }
  }, [spectrumMode, renderer]);
}
