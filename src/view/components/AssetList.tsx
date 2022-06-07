import React, { useCallback } from 'react';
import { deckSortedImageListState, deckSortedSampleListState, deckSortedWavetableListState } from '../states/deck';
import { AssetListCategory } from './AssetListCategory';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { loadFileAsImage } from './utils/loadFileAsImage';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const StyledAssetListCategory = styled( AssetListCategory )`
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

// == components ===================================================================================
export const AssetList: React.FC<{
  hostDeck: WavenerdDeck;
  className?: string;
}> = ( { hostDeck, className } ) => {
  const sortedSampleList = useRecoilValue( deckSortedSampleListState );
  const sortedWavetableList = useRecoilValue( deckSortedWavetableListState );
  const sortedImageList = useRecoilValue( deckSortedImageListState );

  const handleLoadSample = useCallback(
    async ( name: string, file: File ) => {
      const buffer = await file.arrayBuffer();
      await hostDeck.loadSample( name, buffer );
    },
    [ hostDeck ],
  );

  const handleDeleteSample = useCallback(
    ( name: string ) => {
      hostDeck.deleteSample( name );
    },
    [ hostDeck ],
  );

  const handleLoadWavetable = useCallback(
    async ( name: string, file: File ) => {
      const buffer = await file.arrayBuffer();
      const array = new Float32Array( buffer );
      await hostDeck.loadWavetable( name, array );
    },
    [ hostDeck ],
  );

  const handleDeleteWavetable = useCallback(
    ( name: string ) => {
      hostDeck.deleteWavetable( name );
    },
    [ hostDeck ],
  );

  const handleLoadImage = useCallback(
    async ( name: string, file: File ) => {
      const image = await loadFileAsImage( file );
      await hostDeck.loadImage( name, image );
    },
    [ hostDeck ],
  );

  const handleDeleteImage = useCallback(
    ( name: string ) => {
      hostDeck.deleteImage( name );
    },
    [ hostDeck ],
  );

  return (
    <Root
      className={ className }
    >
      <StyledAssetListCategory
        title="Samples"
        assets={ sortedSampleList }
        onLoadAsset={ handleLoadSample }
        onDeleteAsset={ handleDeleteSample }
      />
      <StyledAssetListCategory
        title="Wavetables"
        assets={ sortedWavetableList }
        onLoadAsset={ handleLoadWavetable }
        onDeleteAsset={ handleDeleteWavetable }
      />
      <StyledAssetListCategory
        title="Images"
        assets={ sortedImageList }
        onLoadAsset={ handleLoadImage }
        onDeleteAsset={ handleDeleteImage }
      />
    </Root>
  );
};
