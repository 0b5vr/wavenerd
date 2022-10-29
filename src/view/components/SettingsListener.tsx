import { settingsLatencyBlocksState, settingsVectorscopeColorState, settingsVectorscopeModeState, settingsVectorscopeOpacityState, settingsXFaderModeState } from '../states/settings';
import { SETTINGSMAN } from '../../SettingsManager';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

function SettingsListener(): null {
  const setLatencyBlocks = useSetRecoilState( settingsLatencyBlocksState );
  const setXFaderMode = useSetRecoilState( settingsXFaderModeState );
  const setVectorscopeMode = useSetRecoilState( settingsVectorscopeModeState );
  const setVectorscopeOpacity = useSetRecoilState( settingsVectorscopeOpacityState );
  const setVectorscopeColor = useSetRecoilState( settingsVectorscopeColorState );

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

      const handleChangeVectorscopeMode
        = SETTINGSMAN.on( 'changeVectorscopeMode', ( { mode } ) => {
          setVectorscopeMode( mode );
        } );
      setVectorscopeMode( SETTINGSMAN.vectorscopeMode );

      const handleChangeVectorscopeOpacity
        = SETTINGSMAN.on( 'changeVectorscopeOpacity', ( { opacity } ) => {
          setVectorscopeOpacity( opacity );
        } );
      setVectorscopeOpacity( SETTINGSMAN.vectorscopeOpacity );

      const handleChangeVectorscopeColor
        = SETTINGSMAN.on( 'changeVectorscopeColor', ( { color } ) => {
          setVectorscopeColor( color );
        } );
      setVectorscopeColor( SETTINGSMAN.vectorscopeColor );

      return () => {
        SETTINGSMAN.off( 'changeLatencyBlocks', handleChangeLatencyBlocks );
        SETTINGSMAN.off( 'changeXFaderMode', handleChangeXFaderMode );
        SETTINGSMAN.off( 'changeVectorscopeMode', handleChangeVectorscopeMode );
        SETTINGSMAN.off( 'changeVectorscopeOpacity', handleChangeVectorscopeOpacity );
        SETTINGSMAN.off( 'changeVectorscopeColor', handleChangeVectorscopeColor );
      };
    },
    []
  );

  return null;
}

export { SettingsListener };
