import { useCallback } from 'react';
import { headerIconStyle } from './headerIconStyle';
import styled from 'styled-components';
import IconAlphaBBox from '~icons/mdi/alpha-b-box';
import { useSettings } from '../../stores/hooks/useSettings';
import { SETTINGSMAN } from '../../../SettingsManager';

const StyledIcon = styled(IconAlphaBBox)`
  ${headerIconStyle}
`;

export function HeaderIconDeckB() {
  const deckBShow = useSettings('deckBShow');

  const handleClick = useCallback(() => {
    SETTINGSMAN.set('deckBShow', !SETTINGSMAN.values.deckBShow);
  }, []);

  return (
    <StyledIcon
      onClick={handleClick}
      style={{ opacity: deckBShow ? 1.0 : 0.5 }}
      data-stalker={deckBShow ? 'Hide Deck B' : 'Show Deck B'}
    />
  );
}
