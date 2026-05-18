import { useCallback } from 'react';
import clsx from 'clsx';
import { type SettingsCategory, settingsCategoryAtom } from '../../stores/atoms/settings';
import IconVolumeHigh from '~icons/mdi/volume-high';
import IconPalette from '~icons/mdi/palette';
import IconEye from '~icons/mdi/eye';
import IconCodeBraces from '~icons/mdi/code-braces';
import IconInformation from '~icons/mdi/information';
import IconMidiPort from '~icons/mdi/midi-port';
import { useAtom } from 'jotai';

// == styles =======================================================================================
const iconCls = 'w-4 h-4 mr-1';

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
  audio: <IconVolumeHigh className={iconCls} />,
  midi: <IconMidiPort className={iconCls} />,
  editor: <IconCodeBraces className={iconCls} />,
  appearance: <IconPalette className={iconCls} />,
  visualization: <IconEye className={iconCls} />,
  about: <IconInformation className={iconCls} />,
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
    <div
      className={clsx(
        'py-0.5 px-1 text-xs flex items-center rounded cursor-pointer hover:bg-gray',
        isSelected && 'bg-modal-fg text-modal-bg hover:bg-modal-fg',
      )}
      onClick={handleClick}
    >
      {settingsCategoryIconMap[id]}
      {settingsCategoryNameMap[id]}
    </div>
  );
}

export function SettingsCategoriesMenu() {
  const [category, setCategory] = useAtom(settingsCategoryAtom);

  const handleSelect = useCallback((id: SettingsCategory) => {
    setCategory(id);
  }, [setCategory]);

  return (
    <div className="flex flex-col">
      {settingsCategories.map((id) => (
        <Category
          key={id}
          id={id}
          isSelected={category === id}
          onClick={handleSelect}
        />
      ))}
    </div>
  );
}
