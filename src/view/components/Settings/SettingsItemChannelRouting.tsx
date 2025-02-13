import styled, { css } from 'styled-components';
import { SettingsItemBase } from './SettingsItemBase';
import { ThemeVars } from '../../themes/ThemeVars';
import { useSettings } from '../../stores/hooks/useSettings';
import { useCallback, useContext, useMemo } from 'react';
import { SETTINGSMAN } from '../../../SettingsManager';
import { StuffContext } from '../../StuffContext';

// == styles =======================================================================================
const StyledSelect = styled.select`
  display: inline-block;
  color: ${ThemeVars.inputFore};
  background: ${ThemeVars.inputBack};
  height: 16px;
  border: none;
  border-radius: 4px;
  font: 12px 'Inter', sans-serif;
`;

const LabelSpan = styled.span<{ isActive: boolean }>`
  width: 16px;
  color: ${ThemeVars.foresub};
  opacity: 0.5;

  ${({ isActive }) => isActive && css`
    opacity: 1;
  `}
`;

const Label = styled.div`
  font: 12px 'Roboto Mono', monospace;
`;

const Root = styled.div`
  display: grid;
  grid-template-columns: 24px repeat(2, 1fr);
  align-items: center;
  justify-items: center;
  gap: 4px;
`;

// == components ===================================================================================
const options = [
  { label: '----', value: '' },
  { label: 'Master X', value: 'master:0' },
  { label: 'Master Y', value: 'master:1' },
  { label: 'Cue X', value: 'cue:0' },
  { label: 'Cue Y', value: 'cue:1' },
  { label: 'Deck A X', value: 'deckA:0' },
  { label: 'Deck A Y', value: 'deckA:1' },
  { label: 'Deck B X', value: 'deckB:0' },
  { label: 'Deck B Y', value: 'deckB:1' },
];

function ChannelLabel({ index1, index2 }: { index1: number; index2: number }) {
  const { router } = useContext(StuffContext)!;

  const channelCount = router.channelCount;

  const isActive1 = channelCount >= index1;
  const isActive2 = channelCount >= index2;

  return (
    <Label>
      <LabelSpan isActive={isActive1}>{index1}</LabelSpan>
      <LabelSpan isActive={isActive2}>/</LabelSpan>
      <LabelSpan isActive={isActive2}>{index2}</LabelSpan>
    </Label>
  );
}

function Select({
  value,
  index,
  onChange,
}: {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
}) {
  const handleChange = useCallback((event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    onChange(index, value);
  }, []);

  return (
    <StyledSelect
      value={value}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export function SettingsItemChannelRouting() {
  const value = useSettings('channelRouting');
  const maps = useMemo(() => value.split(','), [value]);

  const handleChange = useCallback((index: number, value: string) => {
    const newMaps = SETTINGSMAN.values['channelRouting'].split(',');
    newMaps[index] = value;
    SETTINGSMAN.set('channelRouting', newMaps.join(','));
  }, []);

  return (
    <SettingsItemBase
      settingsKey="channelRouting"
      name="Channel Routing"
      resettable
      stalkerText="Channel routing.&#10;WebAudio supports up to 8 channels, if the audio output device is capable.&#10;If wavenerd doesn't recognize more than 2 channels, check your OS' audio settings.&#10;I recommend VB-Audio Matrix to bind two or more channels at once."
    >
      <Root>
        <ChannelLabel index1={1} index2={2} />
        <Select value={maps[0]} index={0} onChange={handleChange} />
        <Select value={maps[1]} index={1} onChange={handleChange} />

        <ChannelLabel index1={3} index2={4} />
        <Select value={maps[2]} index={2} onChange={handleChange} />
        <Select value={maps[3]} index={3} onChange={handleChange} />

        <ChannelLabel index1={5} index2={6} />
        <Select value={maps[4]} index={4} onChange={handleChange} />
        <Select value={maps[5]} index={5} onChange={handleChange} />

        <ChannelLabel index1={7} index2={8} />
        <Select value={maps[6]} index={6} onChange={handleChange} />
        <Select value={maps[7]} index={7} onChange={handleChange} />
      </Root>
    </SettingsItemBase>
  );
}
