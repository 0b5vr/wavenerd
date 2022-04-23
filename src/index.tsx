import { App } from './view/components/App';
import { ClockRealtime } from '@0b5vr/experimental';
import { MIDIMAN } from './MIDIManager';
import { MIDIParams } from './MIDIParams';
import { Mixer } from './Mixer';
import React from 'react';
import ReactDOM from 'react-dom';
import { WavenerdDeck } from '@0b5vr/wavenerd-deck';

const canvas = document.createElement( 'canvas' );
const gl = canvas.getContext( 'webgl2' )!;

const audio = new AudioContext();
audio.suspend();

const deckOptions = {
  gl,
  audio,
  latencyBlocks: 32,
};
const deckA = new WavenerdDeck( deckOptions );
const deckB = new WavenerdDeck( { ...deckOptions, hostDeck: deckA } );

const mixer = new Mixer( audio );
deckA.node.connect( mixer.inputL );
deckB.node.connect( mixer.inputR );
mixer.output.connect( audio.destination );

const clock = new ClockRealtime();
clock.play();

function update() {
  clock.update();

  deckA.update();
  deckB.update();
  mixer.updateLevelMeter( clock.deltaTime );

  setTimeout( update, 10 );
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
