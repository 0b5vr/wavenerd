import { settingsLatencyBlocksState, settingsXFaderModeState } from '../states/settings';
import { SETTINGSMAN } from '../../SettingsManager';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

function SettingsListener(): null {
  const setLatencyBlocks = useSetRecoilState( settingsLatencyBlocksState );
  const setXFaderMode = useSetRecoilState( settingsXFaderModeState );

  useEffect(
    () => {
      const handleChangeLatencyBlocks = SETTINGSMAN.on( 'changeLatencyBlocks', ( { blocks } ) => {
        setLatencyBlocks( blocks );
      } );
      setLatencyBlocks( SETTINGSMAN.latencyBlocks );

      const handleChangeXFaderMode = SETTINGSMAN.on( 'changeXFaderMode', ( { mode } ) => {
        setXFaderMode( mode );
      } );
      setXFaderMode( SETTINGSMAN.xfaderMode );

      return () => {
        SETTINGSMAN.off( 'changeXFaderMode', handleChangeXFaderMode );
        SETTINGSMAN.off( 'changeLatencyBlocks', handleChangeLatencyBlocks );
      };
    },
    []
  );

  return null;
}

export { SettingsListener };
