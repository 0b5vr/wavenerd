import React, { useCallback, useState } from 'react';
import { Colors } from '../constants/Colors';
import { SampleListBar } from './SampleListBar';
import { SampleListEntry } from './SampleListEntry';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckSortedSampleListState } from '../states/deck';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == utils ========================================================================================
export function sanitizeSampleName( raw: string ): string | null {
  if ( raw.match( /^[0-9a-zA-Z_]+$/ ) ) {
    return raw;
  }

  return null;
}

// == styles =======================================================================================
const StyledEntry = styled( SampleListEntry )`
  width: calc( 100% - 4px );
  height: 16px;
  margin: 2px;
`;

const Body = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc( 100% - 24px );
  overflow-y: auto;
`;

const StyledSampleListBar = styled( SampleListBar )`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 24px;
`;

const Root = styled.div<{ isDragging: boolean }>`
  position: relative;
  background: ${ ( { isDragging } ) => isDragging ? Colors.back3 : Colors.back1 };
`;

// == components ===================================================================================
function SampleList( { hostDeck, className }: {
  hostDeck: WavenerdDeck;
  className?: string;
} ): JSX.Element {
  const [ isDragging, setIsDragging ] = useState( false );
  const sortedSampleList = useRecoilValue( deckSortedSampleListState );

  const handleFile = useCallback(
    ( files: FileList ) => {
      Array.from( files ).forEach( async ( file ) => {
        const name = sanitizeSampleName( file.name.split( '.' )[ 0 ] );
        if ( name == null ) {
          throw new Error( 'The name of given sample file is not valid' );
        }

        const reader = new FileReader();
        reader.onload = () => {
          const buffer = reader.result as ArrayBuffer;
          hostDeck.loadSample( name, buffer );
        };
        reader.readAsArrayBuffer( file );
      } );
    },
    [ hostDeck ]
  );

  const handleDragOver = useCallback(
    ( event: React.DragEvent<HTMLDivElement> ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( true );
    },
    []
  );

  const handleDragLeave = useCallback(
    ( event: React.DragEvent<HTMLDivElement> ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( false );
    },
    []
  );

  const handleDrop = useCallback(
    ( event: React.DragEvent<HTMLDivElement> ) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragging( false );

      const files = event.dataTransfer.files;
      handleFile( files );
    },
    [ handleFile ]
  );

  return (
    <Root
      className={ className }
      onDragOver={ handleDragOver }
      onDragLeave={ handleDragLeave }
      onDrop={ handleDrop }
      isDragging={ isDragging }
    >
      <Body>
        {
          sortedSampleList.map( ( sample ) => (
            <StyledEntry
              key={ sample }
              name={ sample }
            />
          ) )
        }
      </Body>
      <StyledSampleListBar
        onFile={ handleFile }
      />
    </Root>
  );
}

export { SampleList };
