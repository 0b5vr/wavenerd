import { deckTimeAtom } from '../../stores/atoms/deck';
import { atom, useAtomValue } from 'jotai';
import { ThemeVars } from '../../themes/ThemeVars';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';
import { clsx } from 'clsx';

// == atoms ========================================================================================
const textAtom = atom((get) => {
  const time = get(deckTimeAtom);

  const hours = Math.floor(time / 3600).toString();
  const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
});

// == components ===================================================================================
export function HeaderTimeHMS({ className }: { className?: string }) {
  const text = useAtomValue(textAtom);

  return (
    <div
      className={clsx('flex flex-col text-center', className)}
      data-stalker="Current Global Time"
    >
      <UILabel className="text-header-fg" text="TIME" />
      <UINumber
        text={text}
        activeColor={ThemeVars.headerFg}
        inactiveColor={ThemeVars.gray}
        forceActiveFrom={3}
      />
    </div>
  );
}
