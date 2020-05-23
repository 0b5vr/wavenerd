import { deckBPMState, deckBeatsState, deckTimeState } from '../states/deck';
import { useEffect, useState } from 'react';
import { RateLimitedExecutor } from '../utils/RateLimitedExecutor';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import { useSetRecoilState } from 'recoil';

function DeckListener( { deck }: {
  deck: WavenerdDeck;
} ): null {
  const setDeckTime = useSetRecoilState( deckTimeState );
  const setDeckBeats = useSetRecoilState( deckBeatsState );
  const setDeckBPM = useSetRecoilState( deckBPMState );

  const [ executorProcess ] = useState( new RateLimitedExecutor( 20 ) );
  useEffect(
    () => {
      const handleProcess = deck.on( 'process', () => {
        executorProcess.cue( () => {
          setDeckTime( deck.time );
          setDeckBeats( {
            beat: deck.beatManager.beat,
            bar: deck.beatManager.bar,
            sixteenBar: deck.beatManager.sixteenBar,
          } );
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
    [ executorProcess ]
  );

  return null;
}

export { DeckListener };
