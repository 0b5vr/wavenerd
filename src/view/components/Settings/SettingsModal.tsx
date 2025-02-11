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
import { ThemeVars } from '../../themes/ThemeVars';
import SimpleBar from 'simplebar-react';

// == styles =======================================================================================
const Content = styled(SimpleBar)`
  display: flex;
  flex-direction: column;
  height: 480px;
`;

const VR = styled.div`
  background: ${ThemeVars.gray};
`;

const Root = styled.div`
  display: grid;
  width: 720px;
  grid-template-columns: 120px 1px 1fr;
  gap: 8px;
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

        <VR />

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
