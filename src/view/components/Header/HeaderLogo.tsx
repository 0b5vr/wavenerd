import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';

export function HeaderLogo() {
  const setSettingsOpening = useSetAtom(settingsIsOpeningAtom);
  const setSettingsCategory = useSetAtom(settingsCategoryAtom);

  const handleClick = useCallback(() => {
    setSettingsOpening(true);
    setSettingsCategory('about');
  }, [setSettingsOpening, setSettingsCategory]);

  return (
    <div
      className="font-bold text-2xl font-sans leading-none cursor-pointer hover:opacity-80"
      onClick={handleClick}
    >
      Wavenerd
    </div>
  );
}
