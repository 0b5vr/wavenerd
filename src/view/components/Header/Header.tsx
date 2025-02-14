import { useMemo } from 'react';
import styled from 'styled-components';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatNumber } from './HeaderBeatNumber';
import { HeaderNudge } from './HeaderNudge';
import { HeaderTime } from './HeaderTime';
import { HeaderTransport } from './HeaderTransport';
import { ThemeVars } from '../../themes/ThemeVars';
import { useSettings } from '../../stores/hooks/useSettings';
import { HeaderLogo } from './HeaderLogo';
import { HeaderItemUnknown } from './HeaderItemUnknown';
import { HeaderBeatHex } from './HeaderBeatHex';
import { HeaderBeatDots } from './HeaderBeatDots';
import { HeaderIconRecorder } from './HeaderIconRecorder';
import { HeaderIconHelp } from './HeaderIconHelp';
import { HeaderIconGitHub } from './HeaderIconGitHub';
import { HeaderIconMIDI } from './HeaderIconMIDI';
import { HeaderIconSettings } from './HeaderIconSettings';
import { HeaderIconDeckB } from './HeaderIconDeckB';
import { HeaderIconUnknown } from './HeaderIconUnknown';
import { HeaderIconFullscreen } from './HeaderIconFullscreen';
import { HeaderIconVisualizer } from './HeaderIconVisualizer';

// == styles =======================================================================================
const Margin = styled.div`
  flex-grow: 1 !important;
`;

const Left = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 8px;
  gap: 16px;
`;

const Right = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  background: ${ThemeVars.headerBg};
  color: ${ThemeVars.headerFg};
  border-bottom: solid 2px ${ThemeVars.back1};
  box-sizing: content-box;

  & > * {
    flex-grow: 0;
    flex-shrink: 0;
  }
`;

// == components ===================================================================================
export function Header({ className }: { className?: string }) {
  const headerItems = useSettings('headerItems');
  const headerItemsArray = useMemo(() => headerItems.split(','), [headerItems]);

  const headerIcons = useSettings('headerIcons');
  const headerIconsArray = useMemo(() => headerIcons.split(','), [headerIcons]);
  const headerIconsHasSettings = useMemo(() => headerIconsArray.includes('settings'), [headerIconsArray]);

  return (
    <Root
      className={className}
    >
      <Left>
        {headerItemsArray.map((item, i) => {
          if (item === '') {
            return null;
          } else if (item === 'logo') {
            return <HeaderLogo key={i} />;
          } else if (item === 'transport') {
            return <HeaderTransport key={i} />;
          } else if (item === 'time') {
            return <HeaderTime key={i} />;
          } else if (item === 'beat-number') {
            return <HeaderBeatNumber key={i} />;
          } else if (item === 'beat-hex') {
            return <HeaderBeatHex key={i} />;
          } else if (item === 'beat-dots') {
            return <HeaderBeatDots key={i} />;
          } else if (item === 'bpm') {
            return <HeaderBPM key={i} />;
          } else if (item === 'nudge') {
            return <HeaderNudge key={i} />;
          } else {
            return <HeaderItemUnknown key={i} name={item} />;
          }
        })}
      </Left>

      <Margin />

      <Right>
        {!headerIconsHasSettings && (
          <HeaderIconSettings hidden={true} />
        )}

        {headerIconsArray.map((item, i) => {
          if (item === '') {
            return null;
          } else if (item === 'recorder') {
            return <HeaderIconRecorder key={i} />;
          } else if (item === 'midi') {
            return <HeaderIconMIDI key={i} />;
          } else if (item === 'settings') {
            return <HeaderIconSettings key={i} />;
          } else if (item === 'help') {
            return <HeaderIconHelp key={i} />;
          } else if (item === 'github') {
            return <HeaderIconGitHub key={i} />;
          } else if (item === 'deck-b') {
            return <HeaderIconDeckB key={i} />;
          } else if (item === 'fullscreen') {
            return <HeaderIconFullscreen key={i} />;
          } else if (item === 'visualizer') {
            return <HeaderIconVisualizer key={i} />;
          } else {
            return <HeaderIconUnknown key={i} name={item} />;
          }
        })}
      </Right>
    </Root>
  );
}
