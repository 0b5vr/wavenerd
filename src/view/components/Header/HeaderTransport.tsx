import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import IconPause from '~icons/mdi/pause';
import IconPlay from '~icons/mdi/play';
import IconRewind from '~icons/mdi/skip-previous';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { deckIsPlayingAtom } from '../../stores/atoms/deck';
import { useAtomValue } from 'jotai';

// == styles =======================================================================================
const StyleIconButton = css`
  width: 28px;
  height: 28px;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const StyledIconRewind = styled(IconRewind)`
  ${StyleIconButton}
`;

const StyledIconPlay = styled(IconPlay)`
  ${StyleIconButton}
`;

const StyledIconPause = styled(IconPause)`
  ${StyleIconButton}
`;

const Root = styled.div`
  display: flex;
`;

// == components ===================================================================================
export function HeaderTransport({
  hostDeck,
  className,
}: {
  hostDeck: WavenerdDeck;
  className?: string;
}) {
  const isPlaying = useAtomValue(deckIsPlayingAtom);

  const handleClickRewind = useCallback(() => {
    hostDeck.rewind();
  }, []);

  const handleClickPlay = useCallback(() => {
    hostDeck.play();
  }, []);

  const handleClickPause = useCallback(() => {
    hostDeck.pause();
  }, []);

  return (
    <Root
      className={className}
    >
      <StyledIconRewind
        onClick={handleClickRewind}
        data-stalker="Rewind"
      />
      { !isPlaying && (
        <StyledIconPlay
          onClick={handleClickPlay}
          data-stalker="Play"
        />
      ) }
      { isPlaying && (
        <StyledIconPause
          onClick={handleClickPause}
          data-stalker="Pause"
        />
      ) }
    </Root>
  );
}
