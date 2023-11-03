import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';

interface DeckCodeStorageType {
  a: string;
  b: string;
}

export const deckCodeStorage = new ThrottledJSONStorage<DeckCodeStorageType>( 'wavenerd-code' );
