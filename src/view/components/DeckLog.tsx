import React from 'react';
import { PrimitiveAtom, useAtomValue } from 'jotai';
import { ThemeVars } from '../themes/ThemeVars';
import styled, { keyframes } from 'styled-components';
import { useSettings } from '../stores/hooks/useSettings';

// == styles =======================================================================================
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const Log = styled.div`
  font-size: 12px;
  padding: 0 4px;
  border-radius: 4px;
  background: ${ThemeVars.back3};
  color: ${ThemeVars.fore};
  animation: ease-in ${fadeOut} 2s forwards;
`;

const Root = styled.div`
  position: absolute;
  right: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 4px;
  padding: 4px;
`;

// == component ====================================================================================
interface Props {
  logsAtom: PrimitiveAtom<[ id: number, text: string ][]>;
}

export function DeckLog({ logsAtom }: Props): JSX.Element {
  const logs = useAtomValue(logsAtom);
  const font = useSettings('editorFont');

  return (
    <Root>
      {logs.map(([id, text]) => (
        <Log
          key={id}
          style={{
            font,
            fontVariantLigatures: 'none',
          }}
        >
          {text}
        </Log>
      ))}
    </Root>
  );
}
