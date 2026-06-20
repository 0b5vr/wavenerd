import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { type Visualizer } from '../../visualizers/Visualizer';
import { type Analyser } from '../../../audio/Analyser';

export function useSpectrum(visualizer: Visualizer | undefined, analyser: Analyser): (() => void) | null {
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
  const update = useCallback(() => {
    if (visualizer == null) { return; }

    const { frequencyL } = analyser;
    visualizer.spectrum.setData(frequencyL);
    visualizer.spectrum.render();
  }, [analyser, visualizer]);

  if (spectrumMode === 'none') {
    return null;
  }

  return update;
}
