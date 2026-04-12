import { useCallback } from 'react';
import { ThemeVars } from '../../themes/ThemeVars';
import styled, { css } from 'styled-components';
import { type SettingsCategory, settingsCategoryAtom } from '../../stores/atoms/settings';
import IconVolumeHigh from '~icons/mdi/volume-high';
import IconPalette from '~icons/mdi/palette';
import IconEye from '~icons/mdi/eye';
import IconCodeBraces from '~icons/mdi/code-braces';
import IconInformation from '~icons/mdi/information';
import IconMidiPort from '~icons/mdi/midi-port';
import { useAtom } from 'jotai';

// == styles =======================================================================================
const StyledIcon = css`
  width: 16px;
  height: 16px;
  margin-right: 4px;
`;

const StyledIconAudio = styled(IconVolumeHigh)`
  ${StyledIcon}
`;

const StyledIconMIDI = styled(IconMidiPort)`
  ${StyledIcon}
`;

const StyledIconVisualization = styled(IconEye)`
  ${StyledIcon}
`;

const StyledIconAppearance = styled(IconPalette)`
  ${StyledIcon}
`;

const StyledIconEditor = styled(IconCodeBraces)`
  ${StyledIcon}
`;

const StyledIconAbout = styled(IconInformation)`
  ${StyledIcon}
`;

const StyledCategory = styled.div<{ isSelected: boolean }>`
  padding: 2px 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${ThemeVars.gray};
  }

  ${({ isSelected }) => isSelected && css`
    background-color: ${ThemeVars.modalFg};
    color: ${ThemeVars.modalBg};

    &:hover {
      background-color: ${ThemeVars.modalFg};
    }
  `}
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

// == components ===================================================================================
const settingsCategories: SettingsCategory[] = [
  'audio',
  'midi',
  'editor',
  'appearance',
  'visualization',
  'about',
];

const settingsCategoryNameMap: Record<SettingsCategory, string> = {
  audio: 'Audio',
  midi: 'MIDI',
  editor: 'Editor',
  appearance: 'Appearance',
  visualization: 'Visualization',
  about: 'About',
};

const settingsCategoryIconMap: Record<SettingsCategory, React.ReactNode> = {
  audio: <StyledIconAudio />,
  midi: <StyledIconMIDI />,
  editor: <StyledIconEditor />,
  appearance: <StyledIconAppearance />,
  visualization: <StyledIconVisualization />,
  about: <StyledIconAbout />,
};

function Category({
  id,
  isSelected,
  onClick,
}: {
  id: SettingsCategory;
  isSelected: boolean;
  onClick: (id: SettingsCategory) => void;
}) {
  const handleClick = useCallback(() => {
    onClick(id);
  }, [onClick, id]);
  return (
    <StyledCategory
      isSelected={isSelected}
      onClick={handleClick}
    >
      {settingsCategoryIconMap[id]}
      {settingsCategoryNameMap[id]}
    </StyledCategory>
  );
}

export function SettingsCategoriesMenu() {
  const [category, setCategory] = useAtom(settingsCategoryAtom);

  const handleSelect = useCallback((id: SettingsCategory) => {
    setCategory(id);
  }, [setCategory]);

  return (
    <Root>
      {settingsCategories.map((id) => (
        <Category
          key={id}
          id={id}
          isSelected={category === id}
          onClick={handleSelect}
        />
      ))}
    </Root>
  );
}
