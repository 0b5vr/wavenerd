import { useCallback, useEffect, useRef, useState } from 'react';
import { Visualizer } from '../../visualizers/Visualizer';
import { useRect } from '../../utils/useRect';
import { useElement } from '../../utils/useElement';
import { useFrames } from '../../utils/useFrames';
import { Analyser } from '../../../audio/Analyser';

// == constants ====================================================================================
const MODE_VECTORSCOPE = 0;
const MODE_OSCILLOSCOPE = 1;
const MODE_SPECTRUM = 2;
const N_MODES = 3;

// == functions ====================================================================================
function initVisualizer(canvas: HTMLCanvasElement): Visualizer {
  const visualizer = new Visualizer(canvas);
  visualizer.vectorscope.mode = 'line';
  visualizer.spectrum.mode = 'line';
  visualizer.oscilloscope.mode = 'line';
  return visualizer;
}

function renderVisualizer(visualizer: Visualizer, analyser: Analyser, mode: number): void {
  const { timeDomainL, timeDomainR, frequencyL, timeDomainLoL, convolverBufferLength } = analyser;

  visualizer.clear();

  if (mode === MODE_VECTORSCOPE) {
    visualizer.vectorscope.setData(timeDomainL, timeDomainR);
    visualizer.vectorscope.render();
  } else if (mode === MODE_OSCILLOSCOPE) {
    visualizer.oscilloscope.setData(timeDomainL);
    visualizer.oscilloscope.calcZeroCrossing(timeDomainLoL, convolverBufferLength);
    visualizer.oscilloscope.render();
  } else if (mode === MODE_SPECTRUM) {
    visualizer.spectrum.setData(frequencyL);
    visualizer.spectrum.render();
  }
}

// == component ====================================================================================
export function VisualizerWindow({
  analyser,
}: {
  analyser: Analyser;
}) {
  const [visualizer, setVisualizer] = useState<Visualizer>();
  const [mode, setMode] = useState(0);
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const canvas = useElement(refCanvas);
  const rectCanvas = useRect(refCanvas);

  // setup the visualizer
  useEffect(() => {
    if (canvas == null) { return; }

    const visualizer = initVisualizer(canvas);
    setVisualizer(visualizer);

    return () => visualizer.dispose();
  }, [canvas]);

  // handle resize
  useEffect(() => {
    const ratio = window.devicePixelRatio;
    visualizer?.resize(rectCanvas.width * ratio, rectCanvas.height * ratio);
  }, [visualizer, rectCanvas]);

  // rotate mode
  const changeMode = useCallback(() => {
    setMode((mode) => (mode + 1) % N_MODES);
  }, []);

  // update
  useFrames(useCallback(() => {
    if (visualizer == null) { return; }
    renderVisualizer(visualizer, analyser, mode);
  }, [visualizer, mode]));

  // render
  return (
    <canvas
      ref={refCanvas}
      onClick={changeMode}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        cursor: 'none',
      }}
    />
  );
}
