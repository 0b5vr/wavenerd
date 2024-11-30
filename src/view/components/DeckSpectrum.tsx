import React, { useEffect, useRef, useState } from 'react';
import { Analyser } from '../../Analyser';
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
  analyser: Analyser;
  className?: string;
}

// == component ====================================================================================
export const DeckSpectrum: React.FC<Param> = ( { analyser, className } ) => {
  const [ renderer, setRenderer ] = useState<SpectrumRenderer>();
  const refCanvas = useRef<HTMLCanvasElement>( null );
  const canvas = useElement( refCanvas );
  const rectCanvas = useRect( refCanvas );

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

  // update the renderer
  useFrames( () => {
    if ( spectrumMode !== 'none' ) {
      const { frequencyL } = analyser.update( 0 );
      renderer?.setData( frequencyL );
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
          display: spectrumMode === 'none' ? 'none' : 'block',
        }}
      />
    </Root>
  );
};
