import { deckTimeAtom } from '../../stores/atoms/deck';
import { atom, useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { ThemeVars } from '../../themes/ThemeVars';
import { UINumber } from '../UINumber';
import clsx from 'clsx';

// == atoms ========================================================================================
const textAtom = atom((get) => {
  const time = get(deckTimeAtom);

  if (time < 1000.0) {
    return ('00' + time.toFixed(2)).slice(-6);
  } else if (time < 10000.0) {
    return (time.toFixed(1)).slice(-6);
  } else {
    return time.toFixed();
  }
});

// == components ===================================================================================
export function HeaderTimeSeconds({ className }: { className?: string }) {
  const text = useAtomValue(textAtom);

  return (
    <div
      className={clsx('flex flex-col text-center', className)}
      data-stalker="Current Global Time (time.w)"
    >
      <UILabel className="text-header-fg" text="TIME" />
      <UINumber
        text={text}
        activeColor={ThemeVars.headerFg}
        inactiveColor={ThemeVars.gray}
        forceActiveFrom={2}
      />
    </div>
  );
}
