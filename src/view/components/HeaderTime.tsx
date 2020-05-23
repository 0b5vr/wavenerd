import React from 'react';
import { deckTimeState } from '../states/deck';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Label = styled.div`
  font: 500 10px monospace;
  line-height: 1.0;
`;

const Value = styled.div`
  font: 500 16px monospace;
  line-height: 1.0;
  min-width: 64px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;

// == components ===================================================================================
function HeaderTime( { className }: {
  className?: string;
} ): JSX.Element {
  const time = useRecoilValue( deckTimeState );

  return (
    <Root
      className={ className }
    >
      <Label>Time</Label>
      <Value>{ time.toFixed( 3 ) }</Value>
    </Root>
  );
}

export { HeaderTime };
