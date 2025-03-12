import { deckTimeAtom } from '../../stores/atoms/deck';
import styled from 'styled-components';
import { atom, useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { ThemeVars } from '../../themes/ThemeVars';
import { UINumber } from '../UINumber';

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

// == styles =======================================================================================
const StyledUILabel = styled(UILabel)`
  color: ${ThemeVars.headerFg};
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// == components ===================================================================================
export function HeaderTimeSeconds({ className }: { className?: string }) {
  const text = useAtomValue(textAtom);

  return (
    <Root
      className={className}
      data-stalker="Current Global Time (time.w)"
    >
      <StyledUILabel text="TIME" />
      <UINumber
        text={text}
        activeColor={ThemeVars.headerFg}
        inactiveColor={ThemeVars.gray}
        forceActiveFrom={2}
      />
    </Root>
  );
}
