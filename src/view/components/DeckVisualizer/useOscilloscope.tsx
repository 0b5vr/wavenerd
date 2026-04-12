import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { type Visualizer } from '../../visualizers/Visualizer';
import { type Analyser } from '../../../audio/Analyser';

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

    visualizer.oscilloscope.scale = 0.5;
  }, [visualizer, oscilloscopeMode, oscilloscopeColor, oscilloscopeOpacity]);

  // update the visualizer
  return useCallback(() => {
    if (oscilloscopeMode !== 'none') {
      const { timeDomainL, timeDomainLoL } = analyser;
      visualizer?.oscilloscope.setData(timeDomainL);
      visualizer?.oscilloscope.calcZeroCrossing(timeDomainLoL, analyser.convolverBufferLength);
      visualizer?.oscilloscope.render();
    }
  }, [analyser, oscilloscopeMode, visualizer?.oscilloscope]);
}
