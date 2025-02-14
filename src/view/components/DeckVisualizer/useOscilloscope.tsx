import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { Visualizer } from '../../visualizers/Visualizer';
import { Analyser } from '../../../audio/Analyser';

export function useOscilloscope(visualizer: Visualizer | undefined, analyser: Analyser): () => void {
  const oscilloscopeMode = useSettings('oscilloscopeMode');
  const oscilloscopeOpacity = useSettings('oscilloscopeOpacity');
  const oscilloscopeColor = useSettings('oscilloscopeColor');

  // set mode, color
  useEffect(() => {
    if (visualizer == null) { return; }

    visualizer.oscilloscope.mode = oscilloscopeMode;

    visualizer.oscilloscope.color = [
      parseInt(oscilloscopeColor.slice(1, 3), 16) / 255.0,
      parseInt(oscilloscopeColor.slice(3, 5), 16) / 255.0,
      parseInt(oscilloscopeColor.slice(5, 7), 16) / 255.0,
      oscilloscopeOpacity,
    ];
  }, [visualizer, oscilloscopeMode, oscilloscopeColor, oscilloscopeOpacity]);

  // update the visualizer
  return useCallback(() => {
    if (oscilloscopeMode !== 'none') {
      const { timeDomainL, zeroCrossingLoL } = analyser;
      visualizer?.oscilloscope.setData(timeDomainL, zeroCrossingLoL);
      visualizer?.oscilloscope.render();
    }
  }, [oscilloscopeMode, visualizer]);
}
