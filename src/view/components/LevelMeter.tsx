import { useRef } from 'react';
import { ThemeVars } from '../themes/ThemeVars';
import { saturate } from '@0b5vr/experimental';
import styled from 'styled-components';
import { useRect } from '../utils/useRect';

// == styles =======================================================================================
const Bg = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  background: #000;
  opacity: 0.8;
  transform-origin: top left;
`;

const Bg2 = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  background: #000;
  opacity: 0.8;
  transform-origin: top left;
`;

const Fg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  background: ${ThemeVars.levelMeter};
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
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);
  const height = rect?.height ?? 0;

  const p = saturate(peak * 0.8);
  const l = saturate(level * 0.8);

  const peakTop = height * (1.0 - p);
  const peakBottom = peakTop + 2;
  const levelTop = height * (1.0 - l);

  return (
    <Root
      ref={ref}
      className={className}
    >
      <Fg>
        <Bg
          style={{
            transform: `scaleY(${peakTop})`,
          }}
        />
        <Bg2
          style={{
            transform: `translateY(${peakBottom}px) scaleY(${levelTop - peakBottom})`,
          }}
        />
      </Fg>
    </Root>
  );
}
