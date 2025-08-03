import { EventEmittable } from './utils/EventEmittable';
import { StorageManager } from './StorageManager';

interface LibraryEvents {
  add: { name: string; code: string };
  delete: { name: string };
  initStorage: void;
}

export class Library extends EventEmittable<LibraryEvents> {
  private __fileNames: Set<string>;
  private __storageManager?: StorageManager;

  public constructor() {
    super();
    this.__fileNames = new Set();
  }

  public add(name: string, code: string): void {
    this.__fileNames.add(name);
    this.__storageManager?.save(`/shaders/${name}`, code);
    this.__emit('add', { name, code });
  }

  public delete(name: string): void {
    this.__fileNames.delete(name);
    this.__storageManager?.delete(`/shaders/${name}`);
    this.__emit('delete', { name });
  }

  public async getCode(name: string): Promise<string | undefined> {
    if (!this.__fileNames.has(name) || !this.__storageManager) {
      return undefined;
    }

    const file = await this.__storageManager.getFile(`/shaders/${name}`);
    if (!file) { return undefined; }

    return await file.text();
  }

  public getList(): string[] {
    return Array.from(this.__fileNames);
  }

  public async initStorage(storageManager: StorageManager): Promise<void> {
    this.__storageManager = storageManager;

    const fileNames = await storageManager.listFilesRecursive('/shaders');
    if (fileNames != null) {
      this.__fileNames = new Set(fileNames);
    }

    this.__emit('initStorage');
  }
}
