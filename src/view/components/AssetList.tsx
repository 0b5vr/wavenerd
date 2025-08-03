import { useCallback } from 'react';
import { deckSortedImageListAtom, deckSortedSampleListAtom, deckSortedWavetableListAtom } from '../stores/atoms/deck';
import { AssetListCategory } from './AssetListCategory';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { loadFileAsImage } from './utils/loadFileAsImage';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { storageFileListShadersAtom } from '../stores/atoms/storage';
import { StorageManager } from '../../StorageManager';

// == styles =======================================================================================
const StyledAssetListCategory = styled(AssetListCategory)`
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

// == components ===================================================================================
export function AssetList({ hostDeck, storageManager, className }: {
  hostDeck: WavenerdDeck;
  storageManager: StorageManager;
  className?: string;
}) {
  const shadersList = useAtomValue(storageFileListShadersAtom);
  const sortedSampleList = useAtomValue(deckSortedSampleListAtom);
  const sortedWavetableList = useAtomValue(deckSortedWavetableListAtom);
  const sortedImageList = useAtomValue(deckSortedImageListAtom);

  const handleLoadShader = useCallback(
    async (name: string, file: File) => {
      const code = await file.text();
      storageManager.save(`shaders/${name}`, code);
    },
    [hostDeck],
  );

  const handleDeleteShader = useCallback(
    (name: string) => {
      storageManager.delete(`shaders/${name}`);
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
        title="Shaders"
        assets={shadersList}
        onLoadAsset={handleLoadShader}
        onDeleteAsset={handleDeleteShader}
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
}
