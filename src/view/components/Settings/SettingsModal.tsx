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

// == styles =======================================================================================
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 240px;
  overflow-y: auto;
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: 120px 400px;
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
          {category === 'visualization' && <SettingsContentVisualization />}
          {category === 'appearance' && <SettingsContentAppearance />}
          {category === 'editor' && <SettingsContentEditor />}
        </Content>
      </Root>
    </Modal>
  );
}
