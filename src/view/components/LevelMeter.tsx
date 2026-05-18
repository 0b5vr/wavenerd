import { saturate } from '@0b5vr/experimental';
import clsx from 'clsx';
import styles from './LevelMeter.module.css';

export function LevelMeter({
  level,
  peak,
  className,
}: {
  level: number;
  peak: number;
  className?: string;
}) {
  const p = saturate(peak * 0.8);
  const l = saturate(level * 0.8);

  const peakTop = 1.0 - p;
  const peakBottom = Math.min(peakTop + 0.02, 1.0);
  const levelTop = 1.0 - l;

  return (
    <div className={clsx('relative', className)}>
      <div className={clsx('absolute inset-0', styles.fg)}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1 1" preserveAspectRatio="none">
          <rect fill="black" opacity="0.8" x="-1" y="0" width="3" height={peakTop} />
          <rect fill="black" opacity="0.8" x="-1" y={peakBottom} width="3" height={Math.max(0.0, levelTop - peakBottom)} />
        </svg>
      </div>
    </div>
  );
}
