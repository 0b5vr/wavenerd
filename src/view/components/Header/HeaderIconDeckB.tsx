import { useCallback } from 'react';
import { headerIconCls } from './headerIconCls';
import IconAlphaBBox from '~icons/mdi/alpha-b-box';
import { useSettings } from '../../stores/hooks/useSettings';
import { SETTINGSMAN } from '../../../SettingsManager';

export function HeaderIconDeckB() {
  const deckBShow = useSettings('deckBShow');

  const handleClick = useCallback(() => {
    SETTINGSMAN.set('deckBShow', !SETTINGSMAN.values.deckBShow);
  }, []);

  return (
    <IconAlphaBBox
      className={headerIconCls}
      onClick={handleClick}
      style={{ opacity: deckBShow ? 1.0 : 0.5 }}
      data-stalker={deckBShow ? 'Hide Deck B' : 'Show Deck B'}
    />
  );
}
