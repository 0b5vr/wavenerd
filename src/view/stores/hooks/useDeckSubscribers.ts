import { deckACueStatusAtom, deckAErrorAtom, deckBCueStatusAtom, deckBErrorAtom, deckBPMAtom, deckBeatsAtom, deckIsPlayingAtom, deckTimeAtom } from '../atoms/deck';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

function useDeckASubscribers(deckA: WavenerdDeck) {
  const setDeckACueStatus = useSetAtom(deckACueStatusAtom);
  const setDeckAError = useSetAtom(deckAErrorAtom);

  useEffect(() => {
    const handleChangeCueStatus = deckA.on('changeCueStatus', ({ cueStatus }) => {
      setDeckACueStatus(cueStatus);
    });

    const handleError = deckA.on('error', ({ error }) => {
      setDeckAError(error ?? null);
    });

    return () => {
      deckA.off('changeCueStatus', handleChangeCueStatus);
      deckA.off('error', handleError);
    };
  });
}

function useDeckBSubscribers(deckB: WavenerdDeck) {
  const setDeckBCueStatus = useSetAtom(deckBCueStatusAtom);
  const setDeckBError = useSetAtom(deckBErrorAtom);

  useEffect(() => {
    const handleChangeCueStatus = deckB.on('changeCueStatus', ({ cueStatus }) => {
      setDeckBCueStatus(cueStatus);
    });

    const handleError = deckB.on('error', ({ error }) => {
      setDeckBError(error ?? null);
    });

    return () => {
      deckB.off('changeCueStatus', handleChangeCueStatus);
      deckB.off('error', handleError);
    };
  });
}

function useDeckTransportSubscribers(hostDeck: WavenerdDeck) {
  const setDeckTime = useSetAtom(deckTimeAtom);
  const setDeckBeats = useSetAtom(deckBeatsAtom);
  const setDeckIsPlaying = useSetAtom(deckIsPlayingAtom);
  const setDeckBPM = useSetAtom(deckBPMAtom);

  useEffect(() => {
    const handleBeatManagerUpdate = hostDeck.beatManager.on('update', (event) => {
      setDeckTime(event.time);
      setDeckBeats({
        beat: event.beat,
        bar: event.bar,
        sixteenBar: event.sixteenBar,
      });
    });

    const handlePlay = hostDeck.on('play', () => {
      setDeckIsPlaying(true);
    });

    const handlePause = hostDeck.on('pause', () => {
      setDeckIsPlaying(false);
    });

    const handleChangeBPM = hostDeck.on('changeBPM', ({ bpm }) => {
      setDeckBPM(bpm);
    });

    return () => {
      hostDeck.beatManager.off('update', handleBeatManagerUpdate);
      hostDeck.off('play', handlePlay);
      hostDeck.off('pause', handlePause);
      hostDeck.off('changeBPM', handleChangeBPM);
    };
  });
}

export function useDeckSubscribers(
  hostDeck: WavenerdDeck,
  deckA: WavenerdDeck,
  deckB: WavenerdDeck,
) {
  useDeckASubscribers(deckA);
  useDeckBSubscribers(deckB);
  useDeckTransportSubscribers(hostDeck);
}
