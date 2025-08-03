import { createContext } from 'react';
import { AudioDestinationRouter } from '../audio/AudioDestinationRouter';
import { Recorder } from '../audio/Recorder';
import { Mixer } from '../audio/Mixer';
import WavenerdDeck from '@0b5vr/wavenerd-deck';
import { FullscreenManager } from '../FullscreenManager';
import { FrameEmitter } from '../FrameEmitter';
import { StorageManager } from '../StorageManager';

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
