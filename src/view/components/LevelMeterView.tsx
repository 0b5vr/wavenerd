import { saturate } from '@0b5vr/experimental';
import clsx from 'clsx';
import styles from './LevelMeter.module.css';
import useMeasure from 'react-use-measure';
import { useFrame } from '../utils/useFrame';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type LevelMeter } from '../../audio/LevelMeter';

export function LevelMeterView({
  levelMeter,
  levelKey,
  peakKey,
  className,
}: {
  levelMeter: LevelMeter;
  levelKey: 'level' | 'levelL' | 'levelR';
  peakKey: 'peak' | 'peakL' | 'peakR';
  className?: string;
}) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [refRoot, rectRoot] = useMeasure();

  const canvasWidth = rectRoot.width * window.devicePixelRatio;
  const canvasHeight = rectRoot.height * window.devicePixelRatio;

  // init / resize canvas
  useEffect(() => {
    const canvas = refCanvas.current;
    if (canvas == null) {
      return;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    setContext((prev) => {
      if (prev != null) { return prev; }
      return canvas.getContext('2d');
    });
  }, [canvasWidth, canvasHeight]);

  // render
  useFrame(
    useCallback(() => {
      if (context == null) {
        return;
      }

      const p = saturate(levelMeter[peakKey] * 0.8);
      const l = saturate(levelMeter[levelKey] * 0.8);

      const peakTop = 1.0 - p;
      const peakBottom = Math.min(peakTop + 0.02, 1.0);
      const levelTop = 1.0 - l;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.fillRect(0, 0, canvasWidth, peakTop * canvasHeight);
      context.fillRect(0, peakBottom * canvasHeight, canvasWidth, Math.max(0.0, levelTop - peakBottom) * canvasHeight);
    }, [context, levelMeter, peakKey, levelKey, canvasWidth, canvasHeight]),
  );

  return (
    <div
      ref={refRoot}
      className={clsx('relative', className)}
    >
      <div className={clsx('absolute inset-0', styles.fg)}>
        <canvas
          ref={refCanvas}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
