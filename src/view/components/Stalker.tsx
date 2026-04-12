import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeVars } from '../themes/ThemeVars';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  position: fixed;
  font-size: 12px;
  padding: 4px 8px;
  margin: 8px 16px;
  white-space: pre-line;
  color: ${ThemeVars.foresub};
  background: ${ThemeVars.overlayBack};
  box-shadow: 0 2px 4px 2px #0008;
  border-radius: 4px;
  z-index: 10000;
`;

// == element ======================================================================================
export interface StalkerProps {
  className?: string;
}

export function Stalker({ className }: StalkerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [text, setText] = useState<string | null>(null);
  const stalkerTextElementRef = useRef<HTMLElement | null>(null);

  // mouse listener
  useEffect(
    () => {
      function handleMouseMove(event: MouseEvent): void {
        // update stalker position
        setPosition({ x: event.clientX, y: event.clientY });

        // only update stalker text when not dragging
        if (event.buttons === 0) {
          // traverse up to find element with data-stalker
          let currentTarget: HTMLElement | null = event.target as HTMLElement;
          while ((currentTarget != null) && !(currentTarget?.dataset?.stalker)) {
            currentTarget = currentTarget?.parentElement ?? null;
          }

          // if found, set stalker text element and text
          stalkerTextElementRef.current = currentTarget;
          setText(currentTarget?.dataset?.stalker ?? null);
        }
      }

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    },
    [],
  );

  // poll to update text
  useEffect(() => {
    const id = setInterval(() => {
      setText(stalkerTextElementRef.current?.dataset?.stalker ?? null);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const style: React.CSSProperties = useMemo(
    () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      const ret: React.CSSProperties = {};

      if (position.x < width - 240) {
        ret.left = position.x;
      } else {
        ret.right = width - position.x;
      }

      if (position.y < height - 120) {
        ret.top = position.y;
      } else {
        ret.bottom = height - position.y;
      }
      return ret;
    },
    [position],
  );

  return (
    <>
      {text && (
        <Root className={className} style={style}>
          {text}
        </Root>
      )}
    </>
  );
}
