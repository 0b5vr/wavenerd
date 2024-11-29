import { PrimitiveAtom, useAtomValue } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { AnalyserResult } from '../../Analyser';
import { VectorscopeRenderer } from '../renderers/VectorscopeRenderer';
import styled from 'styled-components';
import { useElement } from '../utils/useElement';
import { useFrames } from '../utils/useFrames';
import { useRect } from '../utils/useRect';
import { useSettings } from '../stores/hooks/useSettings';

// == styles =======================================================================================
const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Root = styled.div``;

// == components ===================================================================================
export const DeckVectorscope: React.FC<{
  analyserAtom: PrimitiveAtom<AnalyserResult>;
  className?: string;
}> = ( { analyserAtom, className } ) => {
  const [ renderer, setRenderer ] = useState<VectorscopeRenderer>();
  const refCanvas = useRef<HTMLCanvasElement>( null );
  const canvas = useElement( refCanvas );
  const rectCanvas = useRect( refCanvas );

  const { timeDomainL, timeDomainR } = useAtomValue( analyserAtom );
  const vectorscopeMode = useSettings( 'vectorscopeMode' );
  const vectorscopeOpacity = useSettings( 'vectorscopeOpacity' );
  const vectorscopeColor = useSettings( 'vectorscopeColor' );

  // setup the renderer
  useEffect( () => {
    if ( canvas == null ) { return; }

    const renderer = new VectorscopeRenderer( canvas );
    setRenderer( renderer );

    return () => {
      renderer.dispose();
    };
  }, [ canvas ] );

  // set mode, color to the renderer
  useEffect( () => {
    if ( renderer == null ) { return; }

    renderer.mode = vectorscopeMode;

    renderer.color = [
      parseInt( vectorscopeColor.slice( 1, 3 ), 16 ) / 255.0,
      parseInt( vectorscopeColor.slice( 3, 5 ), 16 ) / 255.0,
      parseInt( vectorscopeColor.slice( 5, 7 ), 16 ) / 255.0,
      vectorscopeOpacity,
    ];
  }, [ renderer, vectorscopeMode, vectorscopeColor, vectorscopeOpacity ] );

  // set data to the renderer
  useEffect( () => {
    if ( vectorscopeMode !== 'none' ) {
      renderer?.setData( timeDomainL, timeDomainR );
    }
  }, [ timeDomainL, timeDomainR, renderer ] );

  // update the renderer
  useFrames( () => {
    if ( vectorscopeMode !== 'none' ) {
      renderer?.render();
    }
  }, [ renderer ] );

  // handle resize
  useEffect( () => {
    const ratio = window.devicePixelRatio;
    renderer?.resize( rectCanvas.width * ratio, rectCanvas.height * ratio );
  }, [ renderer, rectCanvas ] );

  return (
    <Root className={ className }>
      <Canvas ref={refCanvas}
        style={{
          display: vectorscopeMode === 'none' ? 'none' : 'block',
        }}
      />
    </Root>
  );
};
