import { deckACueStatusAtom, deckAErrorAtom, deckBCueStatusAtom, deckBErrorAtom, deckBPMAtom, deckBeatPositionAtom, deckIsPlayingAtom, deckTimeAtom } from '../atoms/deck';
import { type WavenerdClock, type WavenerdDeck } from '@0b5vr/wavenerd-deck';
import { useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useFrame } from '../../utils/useFrame';

function useDeckASubscribers(deckA: WavenerdDeck) {
  const setDeckACueStatus = useSetAtom(deckACueStatusAtom);
  const setDeckAError = useSetAtom(deckAErrorAtom);

  useEffect(() => {
    const unsubscribeChangeCueStatus = deckA.onChangeCueStatus.subscribe(({ cueStatus }) => {
      setDeckACueStatus(cueStatus);
    });

    const unsubscribeCompile = deckA.onCompile.subscribe(({ error }) => {
      setDeckAError(error ?? null);
    });

    return () => {
      unsubscribeChangeCueStatus();
      unsubscribeCompile();
    };
  });
}

function useDeckBSubscribers(deckB: WavenerdDeck) {
  const setDeckBCueStatus = useSetAtom(deckBCueStatusAtom);
  const setDeckBError = useSetAtom(deckBErrorAtom);

  useEffect(() => {
    const unsubscribeChangeCueStatus = deckB.onChangeCueStatus.subscribe(({ cueStatus }) => {
      setDeckBCueStatus(cueStatus);
    });

    const unsubscribeCompile = deckB.onCompile.subscribe(({ error }) => {
      setDeckBError(error ?? null);
    });

    return () => {
      unsubscribeChangeCueStatus();
      unsubscribeCompile();
    };
  });
}

function useClockSubscribers(clock: WavenerdClock) {
  const setDeckTime = useSetAtom(deckTimeAtom);
  const setDeckBeatPosition = useSetAtom(deckBeatPositionAtom);
  const setDeckIsPlaying = useSetAtom(deckIsPlayingAtom);
  const setDeckBPM = useSetAtom(deckBPMAtom);

  // poll it every frame
  useFrame(
    useCallback(() => {
      const { time } = clock;
      setDeckTime(time);
      setDeckBeatPosition(clock.timeToBeat(time));
    }, [clock, setDeckTime, setDeckBeatPosition]),
  );

  useEffect(() => {
    const unsubscribePlay = clock.onPlay.subscribe(() => {
      setDeckIsPlaying(true);
    });

    const unsubscribePause = clock.onPause.subscribe(() => {
      setDeckIsPlaying(false);
    });

    const unsubscribeChangeBPM = clock.onChangeBPM.subscribe(({ bpm }) => {
      setDeckBPM(bpm);
    });

    return () => {
      unsubscribePlay();
      unsubscribePause();
      unsubscribeChangeBPM();
    };
  });
}

export function useDeckSubscribers(
  clock: WavenerdClock,
  deckA: WavenerdDeck,
  deckB: WavenerdDeck,
) {
  useDeckASubscribers(deckA);
  useDeckBSubscribers(deckB);
  useClockSubscribers(clock);
}
