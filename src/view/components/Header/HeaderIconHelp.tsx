import { useCallback } from 'react';
import { headerIconCls } from './headerIconCls';
import IconHelpCircle from '~icons/mdi/help-circle';

const HELP_URL = 'https://github.com/0b5vr/wavenerd/blob/release/guides/help.md';

export function HeaderIconHelp() {
  const handleClick = useCallback(() => {
    window.open(HELP_URL, '_blank', 'noreferrer');
  }, []);

  return (
    <IconHelpCircle
      className={headerIconCls}
      onClick={handleClick}
      data-stalker="Show help"
    />
  );
}
