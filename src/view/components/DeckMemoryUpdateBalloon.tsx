import React from 'react';
import { PrimitiveAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { ThemeVars } from '../themes/ThemeVars';
import IconLoad from '~icons/mdi/file-download';
import IconX from '~icons/mdi/close';
import IconSave from '~icons/mdi/content-save';

// == styles =======================================================================================
const KeyLabel = styled.div`
  padding-left: 4px;
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const Balloon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font: 500 32px 'Roboto', sans-serif;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${ThemeVars.back3};
  color: ${ThemeVars.fore};
  animation: cubic-bezier(0.9, 0.0, 1.0, 0.75) ${fadeOut} 2s forwards;
`;

const Root = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

// == components ===================================================================================
interface Props {
  memoryUpdateAtom: PrimitiveAtom<{ key: string; status: 'loaded' | 'loadfailed' | 'saved' } | null>;
}

export function DeckMemoryUpdateBalloon(props: Props): JSX.Element | null {
  const { memoryUpdateAtom } = props;

  const memoryUpdate = useAtomValue(memoryUpdateAtom);

  const key = useMemo(() => Date.now(), [memoryUpdate]);

  const icon = useMemo(() => {
    if (memoryUpdate == null) {
      return null;
    } else if (memoryUpdate.status === 'loaded') {
      return <IconLoad />;
    } else if (memoryUpdate.status === 'loadfailed') {
      return <IconX />;
    } else if (memoryUpdate.status === 'saved') {
      return <IconSave />;
    }
  }, [memoryUpdate]);

  if (memoryUpdate == null) {
    return null;
  }

  return (
    <Root>
      <Balloon key={key}>
        <KeyLabel>
          {memoryUpdate.key}
        </KeyLabel>
        {icon}
      </Balloon>
    </Root>
  );
}
