// Shoutouts to taronuke
// https://taro.heysora.net/ecfa/#item9

import { deckBeatPositionAtom } from '../../stores/atoms/deck';
import cajamPng from '../../assets/catjam.png';
import { mod } from '@0b5vr/experimental';
import { atom, useAtomValue } from 'jotai';

// == constants ====================================================================================
const FRAMES = 158;
const BEATS = 13;
const OFFSET = 0.5;

// == atoms ========================================================================================
const frameAtom = atom((get) => {
  const beatPosition = get(deckBeatPositionAtom);

  const beats = beatPosition + OFFSET;

  return Math.floor(mod(beats * FRAMES / BEATS, FRAMES));
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
