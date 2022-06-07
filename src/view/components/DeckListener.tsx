import { deckACueStatusState, deckAErrorState, deckBCueStatusState, deckBErrorState, deckBPMState, deckBeatsState, deckTimeState, useAddImageAction, useAddSampleAction, useAddWavetableAction, useDeleteImageAction, useDeleteSampleAction, useDeleteWavetableAction } from '../states/deck';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
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
  const addWavetable = useAddWavetableAction();
  const deleteWavetable = useDeleteWavetableAction();
  const addImage = useAddImageAction();
  const deleteImage = useDeleteImageAction();

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
      const handleBeatManagerUpdate = hostDeck.beatManager.on( 'update', ( event ) => {
        setDeckTime( event.time );
        setDeckBeats( {
          beat: event.beat,
          bar: event.bar,
          sixteenBar: event.sixteenBar,
        } );
      } );

      const handleChangeBPM = hostDeck.on( 'changeBPM', ( { bpm } ) => {
        setDeckBPM( bpm );
      } );

      return () => {
        hostDeck.beatManager.off( 'update', handleBeatManagerUpdate );
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

  useEffect(
    () => {
      const handleLoadWavetable = hostDeck.on( 'loadWavetable', ( { name } ) => {
        addWavetable( name );
      } );

      return () => {
        hostDeck.off( 'loadWavetable', handleLoadWavetable );
      };
    },
    [ hostDeck, addWavetable ],
  );

  useEffect(
    () => {
      const handleDeleteWavetable = hostDeck.on( 'deleteWavetable', ( { name } ) => {
        deleteWavetable( name );
      } );

      return () => {
        hostDeck.off( 'deleteWavetable', handleDeleteWavetable );
      };
    },
    [ hostDeck, deleteWavetable ]
  );

  useEffect(
    () => {
      const handleLoadImage = hostDeck.on( 'loadImage', ( { name } ) => {
        addImage( name );
      } );

      return () => {
        hostDeck.off( 'loadImage', handleLoadImage );
      };
    },
    [ hostDeck, addImage ],
  );

  useEffect(
    () => {
      const handleDeleteImage = hostDeck.on( 'deleteImage', ( { name } ) => {
        deleteImage( name );
      } );

      return () => {
        hostDeck.off( 'deleteImage', handleDeleteImage );
      };
    },
    [ hostDeck, deleteImage ]
  );

  return null;
}

export { DeckListener };
