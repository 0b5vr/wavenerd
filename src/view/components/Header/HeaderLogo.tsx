import styled from 'styled-components';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';

const Logo = styled.div`
  font: 600 24px 'Inter', sans-serif;
  line-height: 1;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export function HeaderLogo() {
  const setSettingsOpening = useSetAtom(settingsIsOpeningAtom);
  const setSettingsCategory = useSetAtom(settingsCategoryAtom);

  const handleClick = useCallback(() => {
    setSettingsOpening(true);
    setSettingsCategory('about');
  }, [setSettingsOpening, setSettingsCategory]);

  return (
    <Logo onClick={handleClick}>Wavenerd</Logo>
  );
}
