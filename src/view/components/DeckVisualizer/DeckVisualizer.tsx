import { useCallback, useContext, useEffect, useState } from 'react';
import { useVectorscope } from './useVectorscope';
import { type Analyser } from '../../../audio/Analyser';
import { Visualizer } from '../../visualizers/Visualizer';
import { useSpectrum } from './useSpectrum';
import { useOscilloscope } from './useOscilloscope';
import { StuffContext } from '../../StuffContext';
import { useWaveform } from './useWaveform';

export function DeckVisualizer({
  analyser,
  className,
}: {
  analyser: Analyser;
  className?: string;
}) {
  const { frameEmitter } = useContext(StuffContext)!;

  const [visualizer, setVisualizer] = useState<Visualizer>();

  // setup the visualizer
  const refCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas == null) { return; }

    // init / set visualizer
    const visualizer = new Visualizer(canvas);
    setVisualizer(visualizer);

    // handle resize
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const ratio = window.devicePixelRatio;
      visualizer.resize(entry.contentRect.width * ratio, entry.contentRect.height * ratio);
    });
    resizeObserver.observe(canvas);

    // dispose when unmounted
    return () => {
      resizeObserver.disconnect();
      visualizer.dispose();
    };
  }, []);

  // components
  const updateVectorscope = useVectorscope(visualizer, analyser);
  const updateSpectrum = useSpectrum(visualizer, analyser);
  const updateOscilloscope = useOscilloscope(visualizer, analyser);
  const updateWaveform = useWaveform(visualizer, analyser);

  // update
  useEffect(() => {
    const udpate = frameEmitter.on('update', () => {
      visualizer?.clear();

      updateVectorscope();
      updateSpectrum();
      updateOscilloscope();
      updateWaveform();
    });

    return () => frameEmitter.off('update', udpate);
  }, [frameEmitter, visualizer, updateVectorscope, updateSpectrum, updateOscilloscope, updateWaveform]);

  // render
  return (
    <div className={className}>
      <canvas className="w-full h-full" ref={refCanvas} />
    </div>
  );
}
