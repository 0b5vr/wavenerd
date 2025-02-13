declare global {
  interface Keyboard {
    lock(keyCodes?: string[]): Promise<void>;
    unlock(): void;
  }

  interface Navigator {
    keyboard?: Keyboard;
  }
}

export {};
