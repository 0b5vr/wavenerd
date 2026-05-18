import { NumberParam } from '../NumberParam';
import { deckBPMAtom } from '../../stores/atoms/deck';
import { useAtomValue } from 'jotai';
import { useContext } from 'react';
import { StuffContext } from '../../StuffContext';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';
import { clamp } from '@0b5vr/experimental';

// == components ===================================================================================
export function HeaderBPM({ className }: { className?: string }) {
  const { hostDeck } = useContext(StuffContext)!;

  const bpm = useAtomValue(deckBPMAtom);

  return (
    <div
      className={`flex flex-col text-center ${className ?? ''}`}
      data-stalker="Beat Per Minute&#10;Drag up/down to change BPM, Double click to edit"
    >
      <UILabel className="text-header-fg" text="BPM" />
      <NumberParam
        type="float"
        className="font-['Roboto_Mono'] text-[14px] leading-none min-w-13"
        value={bpm}
        onChange={(value) => {
          hostDeck.bpm = clamp(value, 40.0, 999.0);
        }}
        deltaCoarse={1.0}
        deltaFine={0.1}
      >
        <UINumber
          text={('0' + bpm.toFixed(2)).slice(-6)}
          activeColor="var(--color-header-fg)"
          inactiveColor="var(--color-gray)"
        />
      </NumberParam>
    </div>
  );
}
