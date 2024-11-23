import { PrimitiveAtom, useAtomValue } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { AnalyserResult } from '../../Analyser';
import { SpectrumRenderer } from '../renderers/SpectrumRenderer';
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

// == param ========================================================================================
interface Param {
  analyserState: PrimitiveAtom<AnalyserResult>;
  className?: string;
}

// == component ====================================================================================
export const DeckSpectrum: React.FC<Param> = ( { analyserState, className } ) => {
  const [ renderer, setRenderer ] = useState<SpectrumRenderer>();
  const refCanvas = useRef<HTMLCanvasElement>( null );
  const canvas = useElement( refCanvas );
  const rectCanvas = useRect( refCanvas );

  const { frequencyL } = useAtomValue( analyserState );
  const spectrumMode = useSettings( 'spectrumMode' );
  const spectrumOpacity = useSettings( 'spectrumOpacity' );
  const spectrumColor = useSettings( 'spectrumColor' );

  // setup the renderer
  useEffect( () => {
    if ( canvas == null ) { return; }

    const renderer = new SpectrumRenderer( canvas );
    setRenderer( renderer );

    return () => {
      renderer.dispose();
    };
  }, [ canvas ] );

  // set mode, color to the renderer
  useEffect( () => {
    if ( renderer == null ) { return; }

    renderer.mode = spectrumMode;

    renderer.color = [
      parseInt( spectrumColor.slice( 1, 3 ), 16 ) / 255.0,
      parseInt( spectrumColor.slice( 3, 5 ), 16 ) / 255.0,
      parseInt( spectrumColor.slice( 5, 7 ), 16 ) / 255.0,
      spectrumOpacity,
    ];
  }, [ renderer, spectrumMode, spectrumColor, spectrumOpacity ] );

  // set data to the renderer
  useEffect( () => {
    if ( spectrumMode !== 'none' ) {
      renderer?.setData( frequencyL );
    }
  }, [ frequencyL, renderer ] );

  // update the renderer
  useFrames( () => {
    if ( spectrumMode !== 'none' ) {
      renderer?.render();
    }
  }, [ renderer ] );

  // handle resize
  useEffect( () => {
    renderer?.resize( rectCanvas.width, rectCanvas.height );
  }, [ renderer, rectCanvas ] );

  return (
    <Root className={ className }>
      <Canvas ref={refCanvas}
        style={{
          display: spectrumMode === 'none' ? 'none' : 'block',
        }}
      />
    </Root>
  );
};
