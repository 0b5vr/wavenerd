import { settingsLatencyBlocksState, settingsMasterReverbGain, settingsSpectrumColorState, settingsSpectrumModeState, settingsSpectrumOpacityState, settingsThemeState, settingsVectorscopeColorState, settingsVectorscopeModeState, settingsVectorscopeOpacityState, settingsXFaderModeState } from '../states/settings';
import { SETTINGSMAN } from '../../SettingsManager';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

function SettingsListener(): null {
  const setLatencyBlocks = useSetRecoilState( settingsLatencyBlocksState );
  const setMasterReverbGain = useSetRecoilState( settingsMasterReverbGain );
  const setXFaderMode = useSetRecoilState( settingsXFaderModeState );
  const setVectorscopeMode = useSetRecoilState( settingsVectorscopeModeState );
  const setVectorscopeOpacity = useSetRecoilState( settingsVectorscopeOpacityState );
  const setVectorscopeColor = useSetRecoilState( settingsVectorscopeColorState );
  const setSpectrumMode = useSetRecoilState( settingsSpectrumModeState );
  const setSpectrumOpacity = useSetRecoilState( settingsSpectrumOpacityState );
  const setSpectrumColor = useSetRecoilState( settingsSpectrumColorState );
  const setTheme = useSetRecoilState( settingsThemeState );

  useEffect(
    () => {
      const handleChangeLatencyBlocks = SETTINGSMAN.on( 'changeLatencyBlocks', ( { blocks } ) => {
        setLatencyBlocks( blocks );
      } );
      setLatencyBlocks( SETTINGSMAN.latencyBlocks );

      const handleChangeMasterReverbGain = SETTINGSMAN.on(
        'changeMasterReverbGain',
        ( { gain } ) => {
          setMasterReverbGain( gain );
        },
      );
      setMasterReverbGain( SETTINGSMAN.masterReverbGain );

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

      const handleChangeSpectrumMode
        = SETTINGSMAN.on( 'changeSpectrumMode', ( { mode } ) => {
          setSpectrumMode( mode );
        } );
      setSpectrumMode( SETTINGSMAN.spectrumMode );

      const handleChangeSpectrumOpacity
        = SETTINGSMAN.on( 'changeSpectrumOpacity', ( { opacity } ) => {
          setSpectrumOpacity( opacity );
        } );
      setSpectrumOpacity( SETTINGSMAN.spectrumOpacity );

      const handleChangeSpectrumColor
        = SETTINGSMAN.on( 'changeSpectrumColor', ( { color } ) => {
          setSpectrumColor( color );
        } );
      setSpectrumColor( SETTINGSMAN.spectrumColor );

      const handleChangeTheme
        = SETTINGSMAN.on( 'changeTheme', ( { theme } ) => {
          setTheme( theme );
        } );
      setTheme( SETTINGSMAN.theme );

      return () => {
        SETTINGSMAN.off( 'changeLatencyBlocks', handleChangeLatencyBlocks );
        SETTINGSMAN.off( 'changeMasterReverbGain', handleChangeMasterReverbGain );
        SETTINGSMAN.off( 'changeXFaderMode', handleChangeXFaderMode );
        SETTINGSMAN.off( 'changeVectorscopeMode', handleChangeVectorscopeMode );
        SETTINGSMAN.off( 'changeVectorscopeOpacity', handleChangeVectorscopeOpacity );
        SETTINGSMAN.off( 'changeVectorscopeColor', handleChangeVectorscopeColor );
        SETTINGSMAN.off( 'changeSpectrumMode', handleChangeSpectrumMode );
        SETTINGSMAN.off( 'changeSpectrumOpacity', handleChangeSpectrumOpacity );
        SETTINGSMAN.off( 'changeSpectrumColor', handleChangeSpectrumColor );
        SETTINGSMAN.off( 'changeTheme', handleChangeTheme );
      };
    },
    []
  );

  return null;
}

export { SettingsListener };
