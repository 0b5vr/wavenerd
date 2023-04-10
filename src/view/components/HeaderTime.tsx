import React from 'react';
import { deckTimeState } from '../states/deck';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Label = styled.div`
  font: 400 10px 'Poppins', sans-serif;
  line-height: 1;
`;

const Value = styled.div`
  font-size: 16px;
  line-height: 1.0;
  min-width: 64px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;

// == components ===================================================================================
export const HeaderTime: React.FC<{
  className?: string;
}> = ( { className } ) => {
  const time = useRecoilValue( deckTimeState );

  return (
    <Root
      className={ className }
    >
      <Label>Time</Label>
      <Value>{ time.toFixed( 2 ) }</Value>
    </Root>
  );
};
