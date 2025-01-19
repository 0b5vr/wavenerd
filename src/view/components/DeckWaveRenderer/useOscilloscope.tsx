import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { WaveRenderer } from '../../renderers/WaveRenderer';
import { Analyser } from '../../../audio/Analyser';

export function useOscilloscope(renderer: WaveRenderer | undefined, analyser: Analyser): () => void {
  const oscilloscopeMode = useSettings('oscilloscopeMode');
  const oscilloscopeOpacity = useSettings('oscilloscopeOpacity');
  const oscilloscopeColor = useSettings('oscilloscopeColor');

  // set mode, color
  useEffect(() => {
    if (renderer == null) { return; }

    renderer.oscilloscope.mode = oscilloscopeMode;

    renderer.oscilloscope.color = [
      parseInt(oscilloscopeColor.slice(1, 3), 16) / 255.0,
      parseInt(oscilloscopeColor.slice(3, 5), 16) / 255.0,
      parseInt(oscilloscopeColor.slice(5, 7), 16) / 255.0,
      oscilloscopeOpacity,
    ];
  }, [renderer, oscilloscopeMode, oscilloscopeColor, oscilloscopeOpacity]);

  // update the renderer
  return useCallback(() => {
    if (oscilloscopeMode !== 'none') {
      const { timeDomainL, zeroCrossingLoL } = analyser;
      renderer?.oscilloscope.setData(timeDomainL, zeroCrossingLoL);
      renderer?.oscilloscope.render();
    }
  }, [oscilloscopeMode, renderer]);
}
