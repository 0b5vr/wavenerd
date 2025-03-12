import { deckTimeAtom } from '../../stores/atoms/deck';
import styled from 'styled-components';
import { atom, useAtomValue } from 'jotai';
import { ThemeVars } from '../../themes/ThemeVars';
import { UILabel } from '../UILabel';
import { UINumber } from '../UINumber';

// == atoms ========================================================================================
const textAtom = atom((get) => {
  const time = get(deckTimeAtom);

  const hours = Math.floor(time / 3600).toString();
  const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
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
export function HeaderTimeHMS({ className }: { className?: string }) {
  const text = useAtomValue(textAtom);

  return (
    <Root
      className={className}
      data-stalker="Current Global Time"
    >
      <StyledUILabel text="TIME" />
      <UINumber
        text={text}
        activeColor={ThemeVars.headerFg}
        inactiveColor={ThemeVars.gray}
        forceActiveFrom={3}
      />
    </Root>
  );
}
