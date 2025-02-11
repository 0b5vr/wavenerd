import { levelMeterInAAtom, levelMeterInBAtom, levelMeterOutAtom } from '../stores/atoms/analyser';
import { LevelMeter } from './LevelMeter';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';

// == styles =======================================================================================
const StyledLevelMeterA = styled(LevelMeter)`
  width: 2px;
  margin-right: 4px;
`;

const StyledLevelMeterB = styled(LevelMeter)`
  width: 2px;
  margin-left: 4px;
`;

const StyledLevelMeterL = styled(LevelMeter)`
  width: 4px;
  margin-right: 2px;
`;

const StyledLevelMeterR = styled(LevelMeter)`
  width: 4px;
`;

const Root = styled.div`
  display: flex;
  height: 100%;
`;

// == components ===================================================================================
export function LevelMeters({ className }: { className?: string }) {
  const levelMeterInA = useAtomValue(levelMeterInAAtom);
  const levelMeterInB = useAtomValue(levelMeterInBAtom);
  const levelMeterOut = useAtomValue(levelMeterOutAtom);

  return (
    <Root
      className={className}
    >
      <StyledLevelMeterA
        level={levelMeterInA.level}
        peak={levelMeterInA.peak}
      />
      <StyledLevelMeterL
        level={levelMeterOut.levelL}
        peak={levelMeterOut.peakL}
      />
      <StyledLevelMeterR
        level={levelMeterOut.levelR}
        peak={levelMeterOut.peakR}
      />
      <StyledLevelMeterB
        level={levelMeterInB.level}
        peak={levelMeterInB.peak}
      />
    </Root>
  );
}
