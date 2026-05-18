import { useCallback, useContext, useState } from 'react';
import IconPlay from '~icons/mdi/play';
import { StuffContext } from '../StuffContext';

export function PlayOverlay({ className }: { className?: string }) {
  const { hostDeck } = useContext(StuffContext)!;

  const [isOpening, setIsOpening] = useState(true);

  const handleClick = useCallback(() => {
    hostDeck.audio.resume();
    hostDeck.play();
    setIsOpening(false);
  }, [hostDeck]);

  if (!isOpening) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 cursor-pointer ${className ?? ''}`}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-black opacity-80" />
      <div className="absolute inset-0 text-white flex flex-col justify-center items-center">
        <IconPlay className="w-32 h-32 fill-white" />
        <div className="leading-none">
          Wavenerd needs you to press here to activate its audio context.
        </div>
      </div>
    </div>
  );
}
