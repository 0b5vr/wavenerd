import { saturate } from '@0b5vr/experimental';
import clsx from 'clsx';
import styles from './LevelMeter.module.css';
import { useFrame } from '../utils/useFrame';
import { useCallback, useRef } from 'react';
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
  const refMaskTop = useRef<HTMLDivElement>(null);
  const refMaskMid = useRef<HTMLDivElement>(null);

  useFrame(
    useCallback(() => {
      const maskTop = refMaskTop.current;
      const maskMid = refMaskMid.current;
      if (maskTop == null || maskMid == null) {
        return;
      }

      const p = saturate(levelMeter[peakKey] * 0.8);
      const l = saturate(levelMeter[levelKey] * 0.8);

      const peakTop = 1.0 - p;
      const peakBottom = Math.min(peakTop + 0.02, 1.0);
      const levelTop = 1.0 - l;
      const midHeight = Math.max(0.0, levelTop - peakBottom);

      maskTop.style.transform = `scaleY(${peakTop})`;
      maskMid.style.transform = `translateY(${peakBottom * 100}%) scaleY(${midHeight})`;
    }, [levelMeter, peakKey, levelKey]),
  );

  return (
    <div className={clsx('relative', className)}>
      <div className={clsx('absolute inset-0', styles.fg)}>
        <div
          ref={refMaskTop}
          className="absolute inset-x-0 top-0 h-full bg-black/80 origin-top will-change-transform"
        />
        <div
          ref={refMaskMid}
          className="absolute inset-x-0 top-0 h-full bg-black/80 origin-top will-change-transform"
        />
      </div>
    </div>
  );
}
