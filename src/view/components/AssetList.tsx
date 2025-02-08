import React, { useCallback } from 'react';
import { deckSortedImageListAtom, deckSortedSampleListAtom, deckSortedWavetableListAtom } from '../stores/atoms/deck';
import { AssetListCategory } from './AssetListCategory';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { loadFileAsImage } from './utils/loadFileAsImage';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { libraryListSortedAtom } from '../stores/atoms/library';
import { Library } from '../../Library';

// == styles =======================================================================================
const StyledAssetListCategory = styled(AssetListCategory)`
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

// == components ===================================================================================
export const AssetList: React.FC<{
  hostDeck: WavenerdDeck;
  library: Library;
  className?: string;
}> = ({ hostDeck, library, className }) => {
  const libraryListSorted = useAtomValue(libraryListSortedAtom);
  const sortedSampleList = useAtomValue(deckSortedSampleListAtom);
  const sortedWavetableList = useAtomValue(deckSortedWavetableListAtom);
  const sortedImageList = useAtomValue(deckSortedImageListAtom);

  const handleLoadLibrary = useCallback(
    async (name: string, file: File) => {
      const code = await file.text();
      library.add(name, code);
    },
    [hostDeck],
  );

  const handleDeleteLibrary = useCallback(
    (name: string) => {
      library.delete(name);
    },
    [hostDeck],
  );

  const handleLoadSample = useCallback(
    async (name: string, file: File) => {
      const buffer = await file.arrayBuffer();
      await hostDeck.loadSample(name, buffer);
    },
    [hostDeck],
  );

  const handleDeleteSample = useCallback(
    (name: string) => {
      hostDeck.deleteSample(name);
    },
    [hostDeck],
  );

  const handleLoadWavetable = useCallback(
    async (name: string, file: File) => {
      const buffer = await file.arrayBuffer();
      const array = new Float32Array(buffer);
      hostDeck.loadWavetable(name, array);
    },
    [hostDeck],
  );

  const handleDeleteWavetable = useCallback(
    (name: string) => {
      hostDeck.deleteWavetable(name);
    },
    [hostDeck],
  );

  const handleLoadImage = useCallback(
    async (name: string, file: File) => {
      const image = await loadFileAsImage(file);
      hostDeck.loadImage(name, image);
    },
    [hostDeck],
  );

  const handleDeleteImage = useCallback(
    (name: string) => {
      hostDeck.deleteImage(name);
    },
    [hostDeck],
  );

  return (
    <Root
      className={className}
    >
      <StyledAssetListCategory
        title="Library"
        assets={libraryListSorted}
        onLoadAsset={handleLoadLibrary}
        onDeleteAsset={handleDeleteLibrary}
      />
      <StyledAssetListCategory
        title="Samples"
        assets={sortedSampleList}
        onLoadAsset={handleLoadSample}
        onDeleteAsset={handleDeleteSample}
      />
      <StyledAssetListCategory
        title="Wavetables"
        assets={sortedWavetableList}
        onLoadAsset={handleLoadWavetable}
        onDeleteAsset={handleDeleteWavetable}
      />
      <StyledAssetListCategory
        title="Images"
        assets={sortedImageList}
        onLoadAsset={handleLoadImage}
        onDeleteAsset={handleDeleteImage}
      />
    </Root>
  );
};
