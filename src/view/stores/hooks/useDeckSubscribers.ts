import { deckACueStatusAtom, deckAErrorAtom, deckBCueStatusAtom, deckBErrorAtom, deckBPMAtom, deckBeatsAtom, deckImageListAddAtom, deckImageListDeleteAtom, deckIsPlayingAtom, deckSampleListAddAtom, deckTimeAtom, deckWavetableListAddAtom, deckWavetableListDeleteAtom } from '../atoms/deck';
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
      setDeckAError(error?.split('\n')[0] ?? null);
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
      setDeckBError(error?.split('\n')[0] ?? null);
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

function useDeckSampleListSubscriber(hostDeck: WavenerdDeck) {
  const addSample = useSetAtom(deckSampleListAddAtom);
  const deleteSample = useSetAtom(deckSampleListAddAtom);

  useEffect(() => {
    const handleLoadSample = hostDeck.on('loadSample', ({ name }) => {
      addSample(name);
    });

    const handleDeleteSample = hostDeck.on('deleteSample', ({ name }) => {
      deleteSample(name);
    });

    return () => {
      hostDeck.off('loadSample', handleLoadSample);
      hostDeck.off('deleteSample', handleDeleteSample);
    };
  });
}

function useDeckWavetableListSubscriber(hostDeck: WavenerdDeck) {
  const addWavetable = useSetAtom(deckWavetableListAddAtom);
  const deleteWavetable = useSetAtom(deckWavetableListDeleteAtom);

  useEffect(() => {
    const handleLoadWavetable = hostDeck.on('loadWavetable', ({ name }) => {
      addWavetable(name);
    });

    const handleDeleteWavetable = hostDeck.on('deleteWavetable', ({ name }) => {
      deleteWavetable(name);
    });

    return () => {
      hostDeck.off('loadWavetable', handleLoadWavetable);
      hostDeck.off('deleteWavetable', handleDeleteWavetable);
    };
  });
}

function useDeckImageListSubscriber(hostDeck: WavenerdDeck) {
  const addImage = useSetAtom(deckImageListAddAtom);
  const deleteImage = useSetAtom(deckImageListDeleteAtom);

  useEffect(() => {
    const handleLoadImage = hostDeck.on('loadImage', ({ name }) => {
      addImage(name);
    });

    const handleDeleteImage = hostDeck.on('deleteImage', ({ name }) => {
      deleteImage(name);
    });

    return () => {
      hostDeck.off('loadImage', handleLoadImage);
      hostDeck.off('deleteImage', handleDeleteImage);
    };
  });
}

function useDeckAssetsSubscribers(hostDeck: WavenerdDeck) {
  useDeckSampleListSubscriber(hostDeck);
  useDeckWavetableListSubscriber(hostDeck);
  useDeckImageListSubscriber(hostDeck);
}

export function useDeckSubscribers(
  hostDeck: WavenerdDeck,
  deckA: WavenerdDeck,
  deckB: WavenerdDeck,
) {
  useDeckASubscribers(deckA);
  useDeckBSubscribers(deckB);
  useDeckTransportSubscribers(hostDeck);
  useDeckAssetsSubscribers(hostDeck);
}
