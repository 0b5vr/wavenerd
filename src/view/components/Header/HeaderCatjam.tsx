// Shoutouts to taronuke
// https://taro.heysora.net/ecfa/#item9

import styled from 'styled-components';
import { deckBeatsAtom, deckBPMAtom, deckTimeAtom } from '../../stores/atoms/deck';
import cajamPng from '../../assets/catjam.png';
import { BeatManager } from '@0b5vr/wavenerd-deck';
import { atom, useAtomValue } from 'jotai';

// == constants ====================================================================================
const FRAMES = 158;
const BEATS = 13;
const OFFSET = 0.4;

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

// == styles =======================================================================================
const Catjam = styled.div`
  width: 32px;
  height: 32px;
  background-image: url(${cajamPng});
  background-repeat: no-repeat;
`;

// == component ====================================================================================
export function HeaderCatjam() {
  const frame = useAtomValue(frameAtom);

  return (
    <Catjam
      style={{
        backgroundPosition: `-${frame * 32}px 0`,
      }}
    />
  );
}
