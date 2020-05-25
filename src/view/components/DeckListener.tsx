import { deckACueStatusState, deckAErrorState, deckBCueStatusState, deckBErrorState, deckBPMState, deckBeatsState, deckTimeState, useAddSampleAction, useDeleteSampleAction } from '../states/deck';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

function DeckListener( { hostDeck, deckA, deckB }: {
  hostDeck: WavenerdDeck;
  deckA: WavenerdDeck;
  deckB: WavenerdDeck;
} ): null {
  const setDeckACueStatus = useSetRecoilState( deckACueStatusState );
  const setDeckBCueStatus = useSetRecoilState( deckBCueStatusState );
  const setDeckAError = useSetRecoilState( deckAErrorState );
  const setDeckBError = useSetRecoilState( deckBErrorState );
  const setDeckTime = useSetRecoilState( deckTimeState );
  const setDeckBeats = useSetRecoilState( deckBeatsState );
  const setDeckBPM = useSetRecoilState( deckBPMState );
  const addSample = useAddSampleAction();
  const deleteSample = useDeleteSampleAction();

  useEffect(
    () => {
      const handleChangeCueStatus = deckA.on( 'changeCueStatus', ( { cueStatus } ) => {
        setDeckACueStatus( cueStatus );
      } );

      return () => {
        deckA.off( 'changeCueStatus', handleChangeCueStatus );
      };
    },
    [ deckA ]
  );

  useEffect(
    () => {
      const handleChangeCueStatus = deckB.on( 'changeCueStatus', ( { cueStatus } ) => {
        setDeckBCueStatus( cueStatus );
      } );

      return () => {
        deckB.off( 'changeCueStatus', handleChangeCueStatus );
      };
    },
    [ deckB ]
  );

  useEffect(
    () => {
      const handleError = deckA.on( 'error', ( { error } ) => {
        setDeckAError( error?.split( '\n' )[ 0 ] ?? null );
      } );

      return () => {
        deckA.off( 'error', handleError );
      };
    },
    [ deckA ]
  );

  useEffect(
    () => {
      const handleError = deckB.on( 'error', ( { error } ) => {
        setDeckBError( error?.split( '\n' )[ 0 ] ?? null );
      } );

      return () => {
        deckB.off( 'error', handleError );
      };
    },
    [ deckB ]
  );

  useEffect(
    () => {
      const handleProcess = hostDeck.on( 'process', () => {
        setDeckTime( hostDeck.time );
        setDeckBeats( {
          beat: hostDeck.beatManager.beat,
          bar: hostDeck.beatManager.bar,
          sixteenBar: hostDeck.beatManager.sixteenBar,
        } );
      } );

      const handleChangeBPM = hostDeck.on( 'changeBPM', ( { bpm } ) => {
        setDeckBPM( bpm );
      } );

      return () => {
        hostDeck.off( 'process', handleProcess );
        hostDeck.off( 'changeBPM', handleChangeBPM );
      };
    },
    [ hostDeck ]
  );

  useEffect(
    () => {
      const handleLoadSample = hostDeck.on( 'loadSample', ( { name } ) => {
        addSample( name );
      } );

      return () => {
        hostDeck.off( 'loadSample', handleLoadSample );
      };
    },
    [ hostDeck, addSample ]
  );

  useEffect(
    () => {
      const handleDeleteSample = hostDeck.on( 'deleteSample', ( { name } ) => {
        deleteSample( name );
      } );

      return () => {
        hostDeck.off( 'deleteSample', handleDeleteSample );
      };
    },
    [ hostDeck, deleteSample ]
  );

  return null;
}

export { DeckListener };
