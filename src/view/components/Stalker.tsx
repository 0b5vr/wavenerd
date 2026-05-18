import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';

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
        <div
          className={clsx('fixed text-xs py-1 px-2 my-2 mx-4 whitespace-pre-line text-foresub bg-overlay-back shadow-[0_2px_4px_2px_#0008] rounded z-10000', className)}
          style={style}
        >
          {text}
        </div>
      )}
    </>
  );
}
