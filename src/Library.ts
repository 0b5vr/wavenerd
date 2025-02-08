import { EventEmittable } from './utils/EventEmittable';

interface LibraryEvents {
  add: { name: string; code: string };
  delete: { name: string };
}

export class Library extends EventEmittable<LibraryEvents> {
  private __map: Map<string, string>;

  public constructor() {
    super();
    this.__map = new Map();
  }

  public add(name: string, code: string): void {
    this.__map.set(name, code);
    this.__emit('add', { name, code });
  }

  public delete(name: string): void {
    this.__map.delete(name);
    this.__emit('delete', { name });
  }

  public getCode(name: string): string | undefined {
    return this.__map.get(name);
  }
}
