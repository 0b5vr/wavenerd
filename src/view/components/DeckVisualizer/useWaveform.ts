import { useCallback, useEffect } from 'react';
import { useSettings } from '../../stores/hooks/useSettings';
import { type Visualizer } from '../../visualizers/Visualizer';
import { type Analyser } from '../../../audio/Analyser';

export function useWaveform(visualizer: Visualizer | undefined, analyser: Analyser): () => void {
  const waveformMode = useSettings('waveformMode');
  const waveformOpacity = useSettings('waveformOpacity');
  const waveformColor = useSettings('waveformColor');

  // set mode, color
  useEffect(() => {
    if (visualizer == null) { return; }

    visualizer.waveform.mode = waveformMode;

    visualizer.waveform.color = [
      parseInt(waveformColor.slice(1, 3), 16) / 255.0,
      parseInt(waveformColor.slice(3, 5), 16) / 255.0,
      parseInt(waveformColor.slice(5, 7), 16) / 255.0,
      waveformOpacity,
    ];

    visualizer.waveform.scale = 0.5;
  }, [visualizer, waveformMode, waveformColor, waveformOpacity]);

  // update the visualizer
  return useCallback(() => {
    if (waveformMode !== 'none') {
      const { timeDomainL } = analyser;
      visualizer?.waveform.setData(timeDomainL);
      visualizer?.waveform.render();
    }
  }, [waveformMode, visualizer, analyser]);
}
