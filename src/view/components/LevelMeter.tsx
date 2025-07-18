import { ThemeVars } from '../themes/ThemeVars';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';

// == styles =======================================================================================
const Fg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  background: ${ThemeVars.levelMeter};
`;

const Svg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const BlackOverlayRect = styled.rect`
  fill: black;
  opacity: 0.8;
`;

const Root = styled.div`
  position: relative;
`;

// == components ===================================================================================
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
    <Root className={className}>
      <Fg>
        <Svg viewBox="0 0 1 1" preserveAspectRatio="none">
          <BlackOverlayRect x="-1" y="0" width="3" height={peakTop} />
          <BlackOverlayRect x="-1" y={peakBottom} width="3" height={Math.max(0.0, levelTop - peakBottom)} />
        </Svg>
      </Fg>
    </Root>
  );
}
