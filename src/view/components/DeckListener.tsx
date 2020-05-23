import { deckBPMState, deckBeatsState, deckTimeState } from '../states/deck';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

function DeckListener( { deck }: {
  deck: WavenerdDeck;
} ): null {
  const setDeckTime = useSetRecoilState( deckTimeState );
  const setDeckBeats = useSetRecoilState( deckBeatsState );
  const setDeckBPM = useSetRecoilState( deckBPMState );

  useEffect(
    () => {
      const handleProcess = deck.on( 'process', () => {
        setDeckTime( deck.time );
        setDeckBeats( {
          beat: deck.beatManager.beat,
          bar: deck.beatManager.bar,
          sixteenBar: deck.beatManager.sixteenBar,
        } );
      } );

      const handleChangeBPM = deck.on( 'changeBPM', ( { bpm } ) => {
        setDeckBPM( bpm );
      } );

      return () => {
        deck.off( 'process', handleProcess );
        deck.off( 'changeBPM', handleChangeBPM );
      };
    },
    [ deck ]
  );

  return null;
}

export { DeckListener };
