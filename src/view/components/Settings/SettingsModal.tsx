import { Mixer } from '../../../audio/Mixer';
import { useCallback } from 'react';
import { settingsCategoryAtom, settingsIsOpeningAtom } from '../../stores/atoms/settings';
import { useAtom, useAtomValue } from 'jotai';
import { Modal } from '../Modal';
import styled from 'styled-components';
import { SettingsCategoriesMenu } from './SettingsCategoriesMenu';
import { SettingsContentAudio } from './SettingsContentAudio';
import { SettingsContentVisualization } from './SettingsContentVisualization';
import { SettingsContentAppearance } from './SettingsContentAppearance';
import { SettingsContentEditor } from './SettingsContentEditor';
import { SettingsContentAbout } from './SettingsContentAbout';
import { SettingsContentMIDI } from './SettingsContentMIDI';

// == styles =======================================================================================
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 480px;
  overflow-y: auto;
`;

const Root = styled.div`
  display: grid;
  width: 720px;
  grid-template-columns: 120px 1fr;
  gap: 16px;
`;

// == components ===================================================================================
export function SettingsModal({
  mixer,
}: {
  mixer: Mixer;
}) {
  const [isOpening, setOpening] = useAtom(settingsIsOpeningAtom);
  const category = useAtomValue(settingsCategoryAtom);

  const handleClose = useCallback(() => {
    setOpening(false);
  }, []);

  if (!isOpening) {
    return null;
  }

  return (
    <Modal onClose={handleClose}>
      <Root>
        <SettingsCategoriesMenu />

        <Content>
          {category === 'audio' && <SettingsContentAudio mixer={mixer} />}
          {category === 'midi' && <SettingsContentMIDI />}
          {category === 'editor' && <SettingsContentEditor />}
          {category === 'appearance' && <SettingsContentAppearance />}
          {category === 'visualization' && <SettingsContentVisualization />}
          {category === 'about' && <SettingsContentAbout />}
        </Content>
      </Root>
    </Modal>
  );
}
