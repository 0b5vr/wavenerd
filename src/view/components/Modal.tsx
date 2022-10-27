import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import IconClose from '~icons/mdi/close';
import styled from 'styled-components';

// == styles =======================================================================================
const Close = styled( IconClose )`
  position: absolute;
  right: 0px;
  top: -32px;
  width: 32px;
  height: 32px;
  padding: 3px;
  color: ${ Colors.fore };
  cursor: pointer;
  border-radius: 16px;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const Plane = styled.div`
  position: relative;
  margin: 16px;
  padding: 16px;
  max-width: 640px;
  max-height: calc( 100% - 32px );
  overflow: visible;
  border-radius: 4px;
  background: ${ Colors.back2 };
  box-shadow: 0 0 8px 0 ${ Colors.black };
`;

const Root = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba( 0, 0, 0, 0.5 );
`;

// == components ===================================================================================
export const Modal: React.FC<{
  onClose?: () => void;
  children?: React.ReactNode;
}> = ( { onClose, children } ) => {
  const noopStopPropagation = useCallback(
    ( event: React.MouseEvent ) => event.stopPropagation(),
    [],
  );

  const handleClickClose = useCallback( () => {
    onClose?.();
  }, [ onClose ] );

  return (
    <Root onClick={ handleClickClose }>
      <Plane onClick={ noopStopPropagation }>
        <Close
          onClick={ handleClickClose }
        />
        { children }
      </Plane>
    </Root>
  );
};
