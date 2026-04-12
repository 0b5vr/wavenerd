import { createContext } from 'react';
import { type AudioDestinationRouter } from '../audio/AudioDestinationRouter';
import { type Recorder } from '../audio/Recorder';
import { type Mixer } from '../audio/Mixer';
import { type WavenerdDeck } from '@0b5vr/wavenerd-deck';
import { type FullscreenManager } from '../FullscreenManager';
import { type FrameEmitter } from '../FrameEmitter';
import { type StorageManager } from '../StorageManager';

export interface Stuff {
  deckA: WavenerdDeck;
  deckB: WavenerdDeck;
  hostDeck: WavenerdDeck;
  mixer: Mixer;
  recorder: Recorder;
  storageManager: StorageManager;
  router: AudioDestinationRouter;
  fullscreenManager: FullscreenManager;
  frameEmitter: FrameEmitter;
}

export const StuffContext = createContext<Stuff | null>(null);
