import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useVectorscope } from './useVectorscope';
import { Analyser } from '../../../audio/Analyser';
import { Visualizer } from '../../visualizers/Visualizer';
import { useElement } from '../../utils/useElement';
import { useRect } from '../../utils/useRect';
import { useSpectrum } from './useSpectrum';
import { useFrames } from '../../utils/useFrames';
import { useOscilloscope } from './useOscilloscope';

// == styles =======================================================================================
const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Root = styled.div``;

// == components ===================================================================================
export function DeckVisualizer({
  analyser,
  className,
}: {
  analyser: Analyser;
  className?: string;
}) {
  const [visualizer, setVisualizer] = useState<Visualizer>();
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const canvas = useElement(refCanvas);
  const rectCanvas = useRect(refCanvas);

  // setup the visualizer
  useEffect(() => {
    if (canvas == null) { return; }

    const visualizer = new Visualizer(canvas);
    setVisualizer(visualizer);

    return () => {
      visualizer.dispose();
    };
  }, [canvas]);

  // handle resize
  useEffect(() => {
    const ratio = window.devicePixelRatio;
    visualizer?.resize(rectCanvas.width * ratio, rectCanvas.height * ratio);
  }, [visualizer, rectCanvas]);

  // components
  const updateVectorscope = useVectorscope(visualizer, analyser);
  const updateSpectrum = useSpectrum(visualizer, analyser);
  const updateOscilloscope = useOscilloscope(visualizer, analyser);

  // update
  useFrames(useCallback(() => {
    visualizer?.clear();

    updateVectorscope();
    updateSpectrum();
    updateOscilloscope();
  }, [visualizer, updateVectorscope, updateSpectrum, updateOscilloscope]));

  // render
  return (
    <Root className={className}>
      <Canvas
        ref={refCanvas}
      />
    </Root>
  );
}
