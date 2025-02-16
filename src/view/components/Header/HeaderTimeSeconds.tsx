import { deckTimeAtom } from '../../stores/atoms/deck';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { UILabel } from '../UILabel';
import { ThemeVars } from '../../themes/ThemeVars';
import { UINumber } from '../UINumber';
import { useMemo } from 'react';

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
  const time = useAtomValue(deckTimeAtom);

  const text = useMemo(() => {
    if (time < 1000.0) {
      return ('00' + time.toFixed(2)).slice(-6);
    } else if (time < 10000.0) {
      return ('00' + time.toFixed(1)).slice(-5);
    } else {
      return time.toFixed();
    }
  }, [time]);

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
