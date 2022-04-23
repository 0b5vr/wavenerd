import { Colors } from '../constants/Colors';
import React from 'react';
import styled from 'styled-components';

// == styles =======================================================================================
const Label = styled.div`
  width: 40px;
`;

const BarBG = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${ Colors.gray };
`;

const BarFG = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: ${ Colors.fore };
`;

const BarContainer = styled.div`
  position: relative;
  width: 64px;
  height: 2px;
`;

const Value = styled.div`
  width: 48px;
  text-align: right;
`;

const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${ Colors.back3 };
  font: 500 10px monospace;
  line-height: 1.1;
`;

// == components ===================================================================================
export const BeatIndicator: React.FC<{
  label: string;
  progress: number;
  className?: string;
}> = ( { label, progress, className } ) => {
  return (
    <Root
      className={ className }
    >
      <Label>{ label }</Label>
      <BarContainer>
        <BarBG />
        <BarFG
          style={ { width: `${ 100.0 * progress }%` } }
        />
      </BarContainer>
      <Value>{ progress.toFixed( 3 ) }</Value>
    </Root>
  );
};
