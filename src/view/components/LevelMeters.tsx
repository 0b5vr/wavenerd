import clsx from 'clsx';
import { LevelMeterView } from './LevelMeterView';
import { useContext } from 'react';
import { StuffContext } from '../StuffContext';

export function LevelMeters({ className }: { className?: string }) {
  const { mixer } = useContext(StuffContext)!;

  return (
    <div className={clsx('flex h-full', className)}>
      <LevelMeterView
        levelMeter={mixer.levelMeterInA}
        levelKey="level"
        peakKey="peak"
        className="w-0.5 mr-1"
      />
      <LevelMeterView
        levelMeter={mixer.levelMeterOut}
        levelKey="levelL"
        peakKey="peakL"
        className="w-1 mr-0.5"
      />
      <LevelMeterView
        levelMeter={mixer.levelMeterOut}
        levelKey="levelR"
        peakKey="peakR"
        className="w-1"
      />
      <LevelMeterView
        levelMeter={mixer.levelMeterInB}
        levelKey="level"
        peakKey="peak"
        className="w-0.5 ml-1"
      />
    </div>
  );
}
