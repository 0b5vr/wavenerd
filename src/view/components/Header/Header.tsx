import { useMemo } from 'react';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatNumber } from './HeaderBeatNumber';
import { HeaderNudge } from './HeaderNudge';
import { HeaderTimeSeconds } from './HeaderTimeSeconds';
import { HeaderTransport } from './HeaderTransport';
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
import { HeaderBarsGrid } from './HeaderBarsGrid';
import { HeaderTimeHMS } from './HeaderTimeHMS';
import { HeaderCatjam } from './HeaderCatjam';
import { HeaderOBSVR } from './HeaderOBSVR';

// == components ===================================================================================
export function Header({ className }: { className?: string }) {
  const headerItems = useSettings('headerItems');
  const headerItemsArray = useMemo(() => headerItems.split(','), [headerItems]);

  const headerIcons = useSettings('headerIcons');
  const headerIconsArray = useMemo(() => headerIcons.split(','), [headerIcons]);
  const headerIconsHasSettings = useMemo(() => headerIconsArray.includes('settings'), [headerIconsArray]);

  return (
    <div className={`flex items-center bg-header-bg text-header-fg box-content *:shrink-0 ${className ?? ''}`}>
      <div className="h-full flex items-center ml-2 gap-4 shrink-0">
        {headerItemsArray.map((item, i) => {
          if (item === '') {
            return null;
          } else if (item === 'logo') {
            return <HeaderLogo key={i} />;
          } else if (item === '0b5vr') {
            return <HeaderOBSVR key={i} />;
          } else if (item === 'transport') {
            return <HeaderTransport key={i} />;
          } else if (item === 'time-seconds' || item === 'time') {
            return <HeaderTimeSeconds key={i} />;
          } else if (item === 'time-hms') {
            return <HeaderTimeHMS key={i} />;
          } else if (item === 'beat-number') {
            return <HeaderBeatNumber key={i} />;
          } else if (item === 'beat-hex') {
            return <HeaderBeatHex key={i} />;
          } else if (item === 'beat-dots') {
            return <HeaderBeatDots key={i} />;
          } else if (item === 'bars-grid') {
            return <HeaderBarsGrid key={i} />;
          } else if (item === 'bpm') {
            return <HeaderBPM key={i} />;
          } else if (item === 'nudge') {
            return <HeaderNudge key={i} />;
          } else if (item === 'catjam') {
            return <HeaderCatjam key={i} />;
          } else {
            return <HeaderItemUnknown key={i} name={item} />;
          }
        })}
      </div>

      <div className="grow" />

      <div className="h-full flex items-center shrink-0">
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
      </div>
    </div>
  );
}
