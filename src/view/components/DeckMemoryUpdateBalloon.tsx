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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1em;
  height: 1em;
`;

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const Row = styled.div`
  font-size: 32px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const Balloon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font: 400 12px 'Inter', sans-serif;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${ThemeVars.back3};
  color: ${ThemeVars.fore};
  animation: step-end ${fadeOut} 0.5s forwards;
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

  const message = useMemo(() => {
    if (memoryUpdate == null) {
      return null;
    }

    let message = `Memory ${memoryUpdate.key}`;

    if (memoryUpdate.status === 'loaded') {
      message += ' loaded';
    } else if (memoryUpdate.status === 'loadfailed') {
      message += ' empty';
    } else if (memoryUpdate.status === 'saved') {
      message += ' saved';
    }

    return message;
  }, [memoryUpdate]);

  if (memoryUpdate == null) {
    return null;
  }

  return (
    <Root>
      <Balloon key={key}>
        <Row>
          <KeyLabel>
            {memoryUpdate.key}
          </KeyLabel>
          {icon}
        </Row>
        <span>{message}</span>
      </Balloon>
    </Root>
  );
}
