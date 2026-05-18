// Shoutouts to taronuke
// https://taro.heysora.net/ecfa/#item9

import { deckBeatsAtom, deckBPMAtom, deckTimeAtom } from '../../stores/atoms/deck';
import cajamPng from '../../assets/catjam.png';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import { atom, useAtomValue } from 'jotai';

// == constants ====================================================================================
const FRAMES = 158;
const BEATS = 13;
const OFFSET = 0.5;

// == atoms ========================================================================================
const frameAtom = atom((get) => {
  const time = get(deckTimeAtom);
  const bpm = get(deckBPMAtom);
  const { sixteenBar } = get(deckBeatsAtom);

  const beatSeconds = BeatManager.CalcBeatSeconds(bpm);
  const sixteenBarSeconds = BeatManager.CalcSixteenBarSeconds(bpm);

  let beats = sixteenBar / beatSeconds + OFFSET;
  beats += ~~((time - sixteenBarSeconds) / sixteenBarSeconds) * 64;

  return ~~(beats * FRAMES / BEATS) % FRAMES;
});

// == component ====================================================================================
export function HeaderCatjam() {
  const frame = useAtomValue(frameAtom);

  return (
    <div
      className="w-8 h-8 bg-no-repeat"
      style={{
        backgroundImage: `url(${cajamPng})`,
        backgroundPosition: `-${frame * 32}px 0`,
      }}
      data-stalker="live cat reaction"
    />
  );
}
