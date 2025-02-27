import 'symbol-observable';

import { SETTINGSMAN, Settings } from './SettingsManager';
import { App } from './view/components/App';
import { AudioDestinationRouter } from './audio/AudioDestinationRouter';
import { CueMixer } from './audio/CueMixer';
import { MIDIMAN } from './MIDIManager';
import { Mixer } from './audio/Mixer';
import { Reverb } from './audio/Reverb';
import { WavenerdDeck } from '@0b5vr/wavenerd-deck';
import { createRoot } from 'react-dom/client';
import { Recorder } from './audio/Recorder';
import { Library } from './Library';
import { FullscreenManager } from './FullscreenManager';
import { TimeDomainDataProbeNode } from './audio/TimeDomainDataProbeNode';
import { DCRemovalNode } from './audio/DCRemovalNode';
import { FrameEmitter } from './FrameEmitter';

// == setup ========================================================================================
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2')!;

const audio = new AudioContext();
audio.suspend();

// install audio worklet modules
await TimeDomainDataProbeNode.addModule(audio);
await DCRemovalNode.addModule(audio);

const master = audio.createGain();

const deckOptions = {
  gl,
  audio,
  latencyBlocks: 32,
};
const deckA = new WavenerdDeck(deckOptions);
const deckB = new WavenerdDeck({ ...deckOptions, hostDeck: deckA });

const mixer = new Mixer(audio);

deckA.node.connect(mixer.inputA);
deckB.node.connect(mixer.inputB);
mixer.output.connect(master);

const reverb = new Reverb(audio);
reverb.gain.value = SETTINGSMAN.values.masterReverbGain;
mixer.output.connect(reverb.input);
reverb.connect(master);

const cueMixer = new CueMixer(audio);
mixer.channelA.outputForAnal.connect(cueMixer.inputA);
mixer.channelB.outputForAnal.connect(cueMixer.inputB);
master.connect(cueMixer.inputMaster);

const recorder = new Recorder(audio);
master.connect(recorder.input);

const router = new AudioDestinationRouter(audio);

router.addSource('master', master);
router.addSource('cue', cueMixer.output);
router.addSource('deckA', deckA.node);
router.addSource('deckB', deckB.node);

// == updates ======================================================================================
function updateAudio() {
  deckA.update();
  deckB.update();

  setTimeout(updateAudio, 1);
}
updateAudio();

const frameEmitter = new FrameEmitter();

frameEmitter.on('update', ({ deltaTime }) => {
  mixer.updateAnalysers(deltaTime);
});

// == midi =========================================================================================
function applyMidiParam({ paramKey, value }: { paramKey: string; value: number }) {
  if (paramKey === '/mixer/xfader_pos') { mixer.xFaderPos = value; }

  if (paramKey === '/mixer/channel_a/gain') { mixer.channelA.gain = 4.0 * value * value; }
  if (paramKey === '/mixer/channel_a/eq/high') { mixer.channelA.eq.high = 2.0 * value; }
  if (paramKey === '/mixer/channel_a/eq/mid') { mixer.channelA.eq.mid = 2.0 * value; }
  if (paramKey === '/mixer/channel_a/eq/low') { mixer.channelA.eq.low = 2.0 * value; }
  if (paramKey === '/mixer/channel_a/volume') { mixer.channelA.volume = value * value; }

  if (paramKey === '/mixer/channel_b/gain') { mixer.channelB.gain = 4.0 * value * value; }
  if (paramKey === '/mixer/channel_b/eq/high') { mixer.channelB.eq.high = 2.0 * value; }
  if (paramKey === '/mixer/channel_b/eq/mid') { mixer.channelB.eq.mid = 2.0 * value; }
  if (paramKey === '/mixer/channel_b/eq/low') { mixer.channelB.eq.low = 2.0 * value; }
  if (paramKey === '/mixer/channel_b/volume') { mixer.channelB.volume = value * value; }

  if (paramKey === '/cue/channel_a') { cueMixer.gainA = value * value; }
  if (paramKey === '/cue/channel_b') { cueMixer.gainB = value * value; }
  if (paramKey === '/cue/master_mix') { cueMixer.masterMix = value * value; }

  if (paramKey === '/deck_a/knob0') { deckA.setParam('knob0', value); }
  if (paramKey === '/deck_a/knob1') { deckA.setParam('knob1', value); }
  if (paramKey === '/deck_a/knob2') { deckA.setParam('knob2', value); }
  if (paramKey === '/deck_a/knob3') { deckA.setParam('knob3', value); }
  if (paramKey === '/deck_a/knob4') { deckA.setParam('knob4', value); }
  if (paramKey === '/deck_a/knob5') { deckA.setParam('knob5', value); }
  if (paramKey === '/deck_a/knob6') { deckA.setParam('knob6', value); }
  if (paramKey === '/deck_a/knob7') { deckA.setParam('knob7', value); }

  if (paramKey === '/deck_b/knob0') { deckB.setParam('knob0', value); }
  if (paramKey === '/deck_b/knob1') { deckB.setParam('knob1', value); }
  if (paramKey === '/deck_b/knob2') { deckB.setParam('knob2', value); }
  if (paramKey === '/deck_b/knob3') { deckB.setParam('knob3', value); }
  if (paramKey === '/deck_b/knob4') { deckB.setParam('knob4', value); }
  if (paramKey === '/deck_b/knob5') { deckB.setParam('knob5', value); }
  if (paramKey === '/deck_b/knob6') { deckB.setParam('knob6', value); }
  if (paramKey === '/deck_b/knob7') { deckB.setParam('knob7', value); }
}

for (const [paramKey, value] of Object.entries(MIDIMAN.values)) {
  applyMidiParam({ paramKey, value });
}

MIDIMAN.on('paramChange', ({ paramKey, value }) => applyMidiParam({ paramKey, value }));

// == library ======================================================================================
const library = new Library();

// == settings =====================================================================================
function applySettings(settings: Partial<Settings>) {
  if (settings.channelRouting != null) {
    router.setRouting(settings.channelRouting);
  }

  if (settings.latencyBlocks != null) {
    deckA.latencyBlocks = settings.latencyBlocks;
    deckB.latencyBlocks = settings.latencyBlocks;
  }

  if (settings.masterDCRemoval != null) {
    mixer.dcRemoval = settings.masterDCRemoval;
  }

  if (settings.masterReverbGain != null) {
    reverb.gain.value = settings.masterReverbGain;
  }

  if (settings.eqMode != null) {
    mixer.channelA.replaceEQ(settings.eqMode);
    mixer.channelB.replaceEQ(settings.eqMode);
  }
}

applySettings(SETTINGSMAN.values);

SETTINGSMAN.on('change', (settings) => applySettings(settings));

// == fullscreen ===================================================================================
const fullscreenManager = new FullscreenManager();

document.addEventListener('keydown', (event) => {
  if (event.key === 'F11') {
    event.preventDefault();
    fullscreenManager.requestFullscreen();
  }
});

// == render =======================================================================================
const root = createRoot(document.getElementById('root')!);
root.render(
  <App
    stuff={{
      deckA,
      deckB,
      hostDeck: deckA,
      mixer,
      recorder,
      library,
      router,
      fullscreenManager,
      frameEmitter,
    }}
  />,
);
