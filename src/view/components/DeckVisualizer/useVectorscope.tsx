import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { Visualizer } from '../../visualizers/Visualizer';
import { Analyser } from '../../../audio/Analyser';

export function useVectorscope(visualizer: Visualizer | undefined, analyser: Analyser): () => void {
  const vectorscopeMode = useSettings('vectorscopeMode');
  const vectorscopeOpacity = useSettings('vectorscopeOpacity');
  const vectorscopeColor = useSettings('vectorscopeColor');

  // set mode, color
  useEffect(() => {
    if (visualizer == null) { return; }

    visualizer.vectorscope.mode = vectorscopeMode;

    visualizer.vectorscope.color = [
      parseInt(vectorscopeColor.slice(1, 3), 16) / 255.0,
      parseInt(vectorscopeColor.slice(3, 5), 16) / 255.0,
      parseInt(vectorscopeColor.slice(5, 7), 16) / 255.0,
      vectorscopeOpacity,
    ];
  }, [visualizer, vectorscopeMode, vectorscopeColor, vectorscopeOpacity]);

  // update the visualizer
  return useCallback(() => {
    if (vectorscopeMode !== 'none') {
      const { timeDomainL, timeDomainR } = analyser;
      visualizer?.vectorscope.setData(timeDomainL, timeDomainR);
      visualizer?.vectorscope.render();
    }
  }, [vectorscopeMode, visualizer]);
}
