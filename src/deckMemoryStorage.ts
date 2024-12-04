import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';

type DeckMemoryStorageType = Record<string, {
  code?: string;
  head?: number;
}>;

export const deckMemoryStorage = new ThrottledJSONStorage<DeckMemoryStorageType>('wavenerd-memory');
