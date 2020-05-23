import { App } from './view/components/App';
import { GLCat } from '@fms-cat/glcat-ts';
import { MIDIMAN } from './MIDIManager';
import { MIDIParams } from './MIDIParams';
import { Mixer } from './Mixer';
import React from 'react';
import ReactDOM from 'react-dom';
import { WavenerdDeck } from '@fms-cat/wavenerd-deck';

const canvas = document.createElement( 'canvas' );
const gl = canvas.getContext( 'webgl' )!;
const glCat = new GLCat( gl );

const audio = new AudioContext();

const deckOptions = {
  glCat,
  audio,
  bufferSize: 2048,
  timeErrorThreshold: 0.01
};
const deckA = new WavenerdDeck( deckOptions );
const deckB = new WavenerdDeck( { ...deckOptions, hostDeck: deckA } );

const mixer = new Mixer( audio );
deckA.node.connect( mixer.inputL );
deckB.node.connect( mixer.inputR );
mixer.output.connect( audio.destination );

// == midi =========================================================================================
MIDIMAN.on( 'paramChange', ( { key, value } ) => {
  if ( key === MIDIParams.XFader ) {
    mixer.xFaderPos = value;
  }
} );

// == dom ==========================================================================================
const container = document.createElement( 'div' );
document.body.appendChild( container );
ReactDOM.render(
  <App
    deckA={ deckA }
    deckB={ deckB }
    mixer={ mixer }
  />,
  container
);
