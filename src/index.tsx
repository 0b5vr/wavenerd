import { App } from './view/components/App';
import { ClockRealtime } from '@0b5vr/experimental';
import { MIDIMAN } from './MIDIManager';
import { MIDIParams } from './MIDIParams';
import { Mixer } from './Mixer';
import { Reverb } from './Reverb';
import { SETTINGSMAN } from './SettingsManager';
import { WavenerdDeck } from '@0b5vr/wavenerd-deck';
import { createRoot } from 'react-dom/client';

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

SETTINGSMAN.on( 'changeLatencyBlocks', ( { blocks } ) => {
  deckA.latencyBlocks = blocks;
  deckB.latencyBlocks = blocks;
} );

const mixer = new Mixer( audio );
deckA.node.connect( mixer.inputA );
deckB.node.connect( mixer.inputB );
mixer.output.connect( audio.destination );

const reverb = new Reverb( audio );
reverb.gain.value = 0.0;
mixer.output.connect( reverb.input );
reverb.connect( audio.destination );
SETTINGSMAN.on( 'changeMasterReverbGain', ( { gain } ) => {
  reverb.gain.value = gain;
} );

const clock = new ClockRealtime();
clock.play();

function update() {
  clock.update();

  deckA.update();
  deckB.update();
  mixer.updateAnalyser( clock.deltaTime );

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
const root = createRoot( document.getElementById( 'root' )! );
root.render(
  <App
    deckA={ deckA }
    deckB={ deckB }
    mixer={ mixer }
  />
);
