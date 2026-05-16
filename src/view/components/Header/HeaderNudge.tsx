import { useCallback, useContext, useRef, useState } from 'react';
import { registerMouseEvent } from '../../utils/registerMouseEvent';
import { StuffContext } from '../../StuffContext';
import { UILabel } from '../UILabel';

// == components ===================================================================================
export function HeaderNudge({ className }: { className?: string }) {
  const { hostDeck } = useContext(StuffContext)!;

  const [nudgeAmount, setNudgeAmount] = useState(0.0);
  const refRoot = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const initBPM = hostDeck.bpm;

    const rect = refRoot.current!.getBoundingClientRect();
    const center = rect.left + rect.width / 2.0;

    const nudgeAmount = (event.clientX - center);
    setNudgeAmount(nudgeAmount);
    hostDeck.bpm = Math.max(40.0, initBPM + nudgeAmount * 0.1);

    registerMouseEvent((event) => {
      const nudgeAmount = (event.clientX - center);
      setNudgeAmount(nudgeAmount);
      hostDeck.bpm = Math.max(40.0, initBPM + nudgeAmount * 0.1);
    }, () => {
      setNudgeAmount(0.0);
      hostDeck.bpm = initBPM;
    });
  }, [hostDeck]);

  return (
    <div
      className={`relative w-12 h-[calc(100%-8px)] bg-header-fg flex justify-center items-center cursor-pointer *:pointer-events-none ${className ?? ''}`}
      ref={refRoot}
      onMouseDown={handleMouseDown}
      data-stalker="Nudge the beat (drag left and right)"
    >
      <UILabel className="text-header-bg" text="Nudge" />
      <div className="absolute left-[calc(50%-0.5px)] w-px h-full bg-header-bg" />
      <div
        className="absolute h-full bg-white mix-blend-difference"
        style={{
          width: `${Math.abs(nudgeAmount)}px`,
          left: nudgeAmount < 0 ? `calc( 50% - ${-nudgeAmount}px )` : '50%',
        }}
      />
    </div>
  );
}
