import React, { useEffect, useMemo, useState } from 'react';
import { Colors } from '../constants/Colors';
import styled from 'styled-components';

// == styles =======================================================================================
const Root = styled.div`
  position: fixed;
  font: 400 12px 'Poppins', sans-serif;
  padding: 2px 4px;
  margin: 8px 16px;
  white-space: pre-line;
  background: ${ Colors.back1 };
  border-radius: 4px;
  opacity: 0.8;
  z-index: 10000;
`;

// == element ======================================================================================
export interface StalkerProps {
  className?: string;
}

export const Stalker: React.FC<StalkerProps> = ( { className } ) => {
  const [ position, setPosition ] = useState( { x: 0, y: 0 } );
  const [ target, setTarget ] = useState<EventTarget | null>( null );
  const [ text, setText ] = useState<string | null>( null );

  useEffect( // mouse listener
    () => {
      function handleMouseMove( event: MouseEvent ): void {
        setPosition( { x: event.clientX, y: event.clientY } );
        setTarget( event.target );
      }

      window.addEventListener( 'mousemove', handleMouseMove );
      return () => window.removeEventListener( 'mousemove', handleMouseMove );
    },
    []
  );

  useEffect( // kinda lame but call setTimeout to update the message while it's on something
    () => {
      let currentTarget: HTMLElement | null = target as HTMLElement;
      while ( ( currentTarget != null ) && !( currentTarget?.dataset?.stalker ) ) {
        currentTarget = currentTarget?.parentElement || null;
      }

      const newText = currentTarget?.dataset?.stalker;
      if ( newText ) {
        setText( newText );

        let halt = false;
        const update = (): void => {
          if ( halt ) { return; }
          setText( currentTarget!.dataset!.stalker! );
          setTimeout( update, 50 );
        };
        update();

        return () => { halt = true; };
      } else {
        setText( null );
      }
    },
    [ target ]
  );

  const style: React.CSSProperties = useMemo(
    () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      const ret: React.CSSProperties = {};
      ( position.x < width - 240 )
        ? ( ret.left = position.x )
        : ( ret.right = width - position.x );
      ( position.y < height - 120 )
        ? ( ret.top = position.y )
        : ( ret.bottom = height - position.y );
      return ret;
    },
    [ position ]
  );

  return <>
    { text && (
      <Root className={ className } style={ style }>
        { text }
      </Root>
    ) }
  </>;
};
