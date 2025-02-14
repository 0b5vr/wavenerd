import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { Visualizer } from '../../visualizers/Visualizer';
import { Analyser } from '../../../audio/Analyser';

export function useSpectrum(visualizer: Visualizer | undefined, analyser: Analyser): () => void {
  const spectrumMode = useSettings('spectrumMode');
  const spectrumOpacity = useSettings('spectrumOpacity');
  const spectrumColor = useSettings('spectrumColor');

  // set mode, color
  useEffect(() => {
    if (visualizer == null) { return; }

    visualizer.spectrum.mode = spectrumMode;

    visualizer.spectrum.color = [
      parseInt(spectrumColor.slice(1, 3), 16) / 255.0,
      parseInt(spectrumColor.slice(3, 5), 16) / 255.0,
      parseInt(spectrumColor.slice(5, 7), 16) / 255.0,
      spectrumOpacity,
    ];

    visualizer.spectrum.scale = 0.25;
  }, [visualizer, spectrumMode, spectrumColor, spectrumOpacity]);

  // update the visualizer
  return useCallback(() => {
    if (spectrumMode !== 'none') {
      const { frequencyL } = analyser;
      visualizer?.spectrum.setData(frequencyL);
      visualizer?.spectrum.render();
    }
  }, [spectrumMode, visualizer]);
}
