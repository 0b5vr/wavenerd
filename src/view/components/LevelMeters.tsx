import clsx from 'clsx';
import { levelMeterInAAtom, levelMeterInBAtom, levelMeterOutAtom } from '../stores/atoms/analyser';
import { LevelMeter } from './LevelMeter';
import { useAtomValue } from 'jotai';

export function LevelMeters({ className }: { className?: string }) {
  const levelMeterInA = useAtomValue(levelMeterInAAtom);
  const levelMeterInB = useAtomValue(levelMeterInBAtom);
  const levelMeterOut = useAtomValue(levelMeterOutAtom);

  return (
    <div className={clsx('flex h-full', className)}>
      <LevelMeter
        className="w-0.5 mr-1"
        level={levelMeterInA.level}
        peak={levelMeterInA.peak}
      />
      <LevelMeter
        className="w-1 mr-0.5"
        level={levelMeterOut.levelL}
        peak={levelMeterOut.peakL}
      />
      <LevelMeter
        className="w-1"
        level={levelMeterOut.levelR}
        peak={levelMeterOut.peakR}
      />
      <LevelMeter
        className="w-0.5 ml-1"
        level={levelMeterInB.level}
        peak={levelMeterInB.peak}
      />
    </div>
  );
}
