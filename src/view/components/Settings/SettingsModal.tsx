import { useCallback } from 'react';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useAtom, useAtomValue } from 'jotai';
import { Modal } from '../Modal';
import { SettingsCategoriesMenu } from './SettingsCategoriesMenu';
import { SettingsContentAudio } from './SettingsContentAudio';
import { SettingsContentVisualization } from './SettingsContentVisualization';
import { SettingsContentAppearance } from './SettingsContentAppearance';
import { SettingsContentEditor } from './SettingsContentEditor';
import { SettingsContentAbout } from './SettingsContentAbout';
import { SettingsContentMIDI } from './SettingsContentMIDI';
import SimpleBar from 'simplebar-react';

// == components ===================================================================================
export function SettingsModal() {
  const [isOpening, setOpening] = useAtom(settingsIsOpeningAtom);
  const category = useAtomValue(settingsCategoryAtom);

  const handleClose = useCallback(() => {
    setOpening(false);
  }, [setOpening]);

  if (!isOpening) {
    return null;
  }

  return (
    <Modal onClose={handleClose}>
      <div className="grid w-180 grid-cols-[120px_1px_1fr] gap-2">
        <SettingsCategoriesMenu />

        <div className="bg-gray" />

        <SimpleBar className="flex flex-col h-120">
          {category === 'audio' && <SettingsContentAudio />}
          {category === 'midi' && <SettingsContentMIDI />}
          {category === 'editor' && <SettingsContentEditor />}
          {category === 'appearance' && <SettingsContentAppearance />}
          {category === 'visualization' && <SettingsContentVisualization />}
          {category === 'about' && <SettingsContentAbout />}
        </SimpleBar>
      </div>
    </Modal>
  );
}
