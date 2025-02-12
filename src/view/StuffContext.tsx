import { createContext } from 'react';
import { AudioDestinationRouter } from '../audio/AudioDestinationRouter';

export interface Stuff {
  router: AudioDestinationRouter;
}

export const StuffContext = createContext<Stuff | null>(null);
