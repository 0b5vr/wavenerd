import 'symbol-observable';

import { SETTINGSMAN, Settings } from './SettingsManager';
import { App } from './view/components/App';
import { AudioDestinationRouter } from './AudioDestinationRouter';
import { ClockRealtime } from '@0b5vr/experimental';
import { CueMixer } from './CueMixer';
import { MIDIMAN } from './MIDIManager';
import { Mixer } from './Mixer';
import { Reverb } from './Reverb';
import { WavenerdDeck } from '@0b5vr/wavenerd-deck';
import { createRoot } from 'react-dom/client';

const canvas = document.createElement( 'canvas' );
const gl = canvas.getContext( 'webgl2' )!;

const audio = new AudioContext();
audio.suspend();

const master = audio.createGain();

const deckOptions = {
  gl,
  audio,
  latencyBlocks: 32,
};
const deckA = new WavenerdDeck( deckOptions );
const deckB = new WavenerdDeck( { ...deckOptions, hostDeck: deckA } );

const mixer = new Mixer( audio );

deckA.node.connect( mixer.inputA );
deckB.node.connect( mixer.inputB );
mixer.output.connect( master );

const reverb = new Reverb( audio );
reverb.gain.value = SETTINGSMAN.values.masterReverbGain;
mixer.output.connect( reverb.input );
reverb.connect( master );

const cueMixer = new CueMixer( audio );
mixer.channelA.output.connect( cueMixer.inputA );
mixer.channelB.output.connect( cueMixer.inputB );
master.connect( cueMixer.inputMaster );

const router = new AudioDestinationRouter( audio );

router.addSource( 'master', master );
router.addSource( 'cue', cueMixer.output );
router.addSource( 'deckA', deckA.node );
router.addSource( 'deckB', deckB.node );

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
function applyMidiParam( { key, value }: { key: string, value: number } ) {
  ( key === '/mixer/xfader_pos' ) && ( mixer.xFaderPos = value );

  ( key === '/mixer/channel_a/gain' ) && ( mixer.channelA.gain = 4.0 * value * value );
  ( key === '/mixer/channel_a/eq/high' ) && ( mixer.channelA.eq.high = 4.0 * value * value );
  ( key === '/mixer/channel_a/eq/mid' ) && ( mixer.channelA.eq.mid = 4.0 * value * value );
  ( key === '/mixer/channel_a/eq/low' ) && ( mixer.channelA.eq.low = 4.0 * value * value );
  ( key === '/mixer/channel_a/volume' ) && ( mixer.channelA.volume = value * value );

  ( key === '/mixer/channel_b/gain' ) && ( mixer.channelB.gain = 4.0 * value * value );
  ( key === '/mixer/channel_b/eq/high' ) && ( mixer.channelB.eq.high = 4.0 * value * value );
  ( key === '/mixer/channel_b/eq/mid' ) && ( mixer.channelB.eq.mid = 4.0 * value * value );
  ( key === '/mixer/channel_b/eq/low' ) && ( mixer.channelB.eq.low = 4.0 * value * value );
  ( key === '/mixer/channel_b/volume' ) && ( mixer.channelB.volume = value * value );

  ( key === '/cue/channel_a' ) && ( cueMixer.gainA = value * value );
  ( key === '/cue/channel_b' ) && ( cueMixer.gainB = value * value );
  ( key === '/cue/master_mix' ) && ( cueMixer.masterMix = value * value );

  ( key === '/deck_a/knob0' ) && ( deckA.setParam( 'knob0', value ) );
  ( key === '/deck_a/knob1' ) && ( deckA.setParam( 'knob1', value ) );
  ( key === '/deck_a/knob2' ) && ( deckA.setParam( 'knob2', value ) );
  ( key === '/deck_a/knob3' ) && ( deckA.setParam( 'knob3', value ) );
  ( key === '/deck_a/knob4' ) && ( deckA.setParam( 'knob4', value ) );
  ( key === '/deck_a/knob5' ) && ( deckA.setParam( 'knob5', value ) );
  ( key === '/deck_a/knob6' ) && ( deckA.setParam( 'knob6', value ) );
  ( key === '/deck_a/knob7' ) && ( deckA.setParam( 'knob7', value ) );

  ( key === '/deck_b/knob0' ) && ( deckB.setParam( 'knob0', value ) );
  ( key === '/deck_b/knob1' ) && ( deckB.setParam( 'knob1', value ) );
  ( key === '/deck_b/knob2' ) && ( deckB.setParam( 'knob2', value ) );
  ( key === '/deck_b/knob3' ) && ( deckB.setParam( 'knob3', value ) );
  ( key === '/deck_b/knob4' ) && ( deckB.setParam( 'knob4', value ) );
  ( key === '/deck_b/knob5' ) && ( deckB.setParam( 'knob5', value ) );
  ( key === '/deck_b/knob6' ) && ( deckB.setParam( 'knob6', value ) );
  ( key === '/deck_b/knob7' ) && ( deckB.setParam( 'knob7', value ) );
}

for ( const [ key, value ] of Object.entries( MIDIMAN.values ) ) {
  applyMidiParam( { key, value } );
}

MIDIMAN.on( 'paramChange', ( { key, value } ) => applyMidiParam( { key, value } ) );

// == settings =====================================================================================
function applySettings( settings: Partial<Settings> ) {
  if ( settings.channelRouting != null ) {
    router.setRouting( settings.channelRouting );
  }

  if ( settings.latencyBlocks != null ) {
    deckA.latencyBlocks = settings.latencyBlocks;
    deckB.latencyBlocks = settings.latencyBlocks;
  }

  if ( settings.masterDCRemoval != null ) {
    mixer.dcRemoval = settings.masterDCRemoval;
  }

  if ( settings.masterReverbGain != null ) {
    reverb.gain.value = settings.masterReverbGain;
  }

  if ( settings.eqMode != null ) {
    mixer.channelA.replaceEQ( settings.eqMode );
    mixer.channelB.replaceEQ( settings.eqMode );
  }
}

applySettings( SETTINGSMAN.values );

SETTINGSMAN.on( 'change', ( settings ) => applySettings( settings ) );

// == dom ==========================================================================================
const root = createRoot( document.getElementById( 'root' )! );
root.render(
  <App
    deckA={ deckA }
    deckB={ deckB }
    mixer={ mixer }
  />
);
