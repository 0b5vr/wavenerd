import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { WaveRenderer } from '../../renderers/WaveRenderer';
import { Analyser } from '../../../audio/Analyser';

export function useVectorscope(renderer: WaveRenderer | undefined, analyser: Analyser): () => void {
  const vectorscopeMode = useSettings('vectorscopeMode');
  const vectorscopeOpacity = useSettings('vectorscopeOpacity');
  const vectorscopeColor = useSettings('vectorscopeColor');

  // set mode, color
  useEffect(() => {
    if (renderer == null) { return; }

    renderer.vectorscope.mode = vectorscopeMode;

    renderer.vectorscope.color = [
      parseInt(vectorscopeColor.slice(1, 3), 16) / 255.0,
      parseInt(vectorscopeColor.slice(3, 5), 16) / 255.0,
      parseInt(vectorscopeColor.slice(5, 7), 16) / 255.0,
      vectorscopeOpacity,
    ];
  }, [renderer, vectorscopeMode, vectorscopeColor, vectorscopeOpacity]);

  // update the renderer
  return useCallback(() => {
    if (vectorscopeMode !== 'none') {
      const { timeDomainL, timeDomainR } = analyser;
      renderer?.vectorscope.setData(timeDomainL, timeDomainR);
      renderer?.vectorscope.render();
    }
  }, [vectorscopeMode, renderer]);
}
