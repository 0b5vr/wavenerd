import { App } from './view/components/App';
import { GLCat } from '@fms-cat/glcat-ts';
import { MIDIMAN } from './MIDIManager';
import { MIDIParams } from './MIDIParams';
import { Mixer } from './Mixer';
import React from 'react';
import ReactDOM from 'react-dom';
import { WavenerdDeck } from '@fms-cat/wavenerd-deck';

const canvas = document.createElement( 'canvas' );
const gl = canvas.getContext( 'webgl2' )!;
const glCat = new GLCat( gl );

const audio = new AudioContext();
audio.suspend();

const deckOptions = {
  glCat,
  audio,
  bufferLength: 48000,
};
const deckA = new WavenerdDeck( deckOptions );
const deckB = new WavenerdDeck( { ...deckOptions, hostDeck: deckA } );

const mixer = new Mixer( audio );
deckA.node.connect( mixer.inputL );
deckB.node.connect( mixer.inputR );
mixer.output.connect( audio.destination );

function update() {
  requestAnimationFrame( update );
  deckA.update();
  deckB.update();
}
update();

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
