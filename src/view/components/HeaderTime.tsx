import { Colors } from '../constants/Colors';
import React from 'react';
import { deckTimeState } from '../states/deck';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

// == styles =======================================================================================
const Label = styled.div`
  font: 500 8px 'Roboto', sans-serif;
  color: ${ Colors.foresub };
  line-height: 1;
`;

const Value = styled.div`
  font-size: 14px;
  line-height: 1.0;
  min-width: 64px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// == components ===================================================================================
export const HeaderTime: React.FC<{
  className?: string;
}> = ( { className } ) => {
  const time = useRecoilValue( deckTimeState );

  return (
    <Root
      className={ className }
      data-stalker="Current Global Time (time.w)"
    >
      <Label>TIME</Label>
      <Value>{ time.toFixed( 2 ) }</Value>
    </Root>
  );
};
