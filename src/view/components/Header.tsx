import { Colors } from '../constants/Colors';
import { HeaderBPM } from './HeaderBPM';
import { HeaderBeatIndicators } from './HeaderBeatIndicators';
import { HeaderTime } from './HeaderTime';
import React from 'react';
import WavenerdDeck from '@fms-cat/wavenerd-deck';
import styled from 'styled-components';

// == styles =======================================================================================
const Logo = styled.div`
  font: 500 24px monospace;
  line-height: 1.0;
`;

const Root = styled.div`
  display: flex;
  align-items: center;
  background: ${ Colors.back3 };

  & > * {
    margin: 0 8px;
  }
`;

// == components ===================================================================================
function Header( { hostDeck, className }: {
  hostDeck: WavenerdDeck;
  className?: string;
} ): JSX.Element {
  return (
    <Root
      className={ className }
    >
      <Logo>Wavenerd</Logo>
      <HeaderTime />
      <HeaderBeatIndicators />
      <HeaderBPM
        hostDeck={ hostDeck }
      />
    </Root>
  );
}

export { Header };
