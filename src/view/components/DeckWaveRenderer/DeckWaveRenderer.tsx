import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useVectorscope } from './useVectorscope';
import { Analyser } from '../../../audio/Analyser';
import { WaveRenderer } from '../../renderers/WaveRenderer';
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
export function DeckWaveRenderer({
  analyser,
  className,
}: {
  analyser: Analyser;
  className?: string;
}) {
  const [renderer, setRenderer] = useState<WaveRenderer>();
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const canvas = useElement(refCanvas);
  const rectCanvas = useRect(refCanvas);

  // setup the renderer
  useEffect(() => {
    if (canvas == null) { return; }

    const renderer = new WaveRenderer(canvas);
    setRenderer(renderer);

    return () => {
      renderer.dispose();
    };
  }, [canvas]);

  // handle resize
  useEffect(() => {
    const ratio = window.devicePixelRatio;
    renderer?.resize(rectCanvas.width * ratio, rectCanvas.height * ratio);
  }, [renderer, rectCanvas]);

  // components
  const updateVectorscope = useVectorscope(renderer, analyser);
  const updateSpectrum = useSpectrum(renderer, analyser);
  const updateOscilloscope = useOscilloscope(renderer, analyser);

  // update
  useFrames(useCallback(() => {
    renderer?.clear();

    updateVectorscope();
    updateSpectrum();
    updateOscilloscope();
  }, [renderer, updateVectorscope, updateSpectrum, updateOscilloscope]));

  // render
  return (
    <Root className={className}>
      <Canvas
        ref={refCanvas}
      />
    </Root>
  );
}
