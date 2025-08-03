import { EventEmittable } from './utils/EventEmittable';

interface StorageManagerEvents {
  init: void;
  save: { path: string };
  delete: { path: string };
}

export class StorageManager extends EventEmittable<StorageManagerEvents> {
  private __root?: FileSystemDirectoryHandle;
  private __directoryCache = new Map<string, FileSystemDirectoryHandle>();

  public async init(): Promise<void> {
    try {
      this.__root = await navigator.storage.getDirectory();
    } catch (error) {
      console.warn('OPFS not available:', error);
    }

    this.__emit('init');
  }

  public async save(path: string, content: BufferSource | Blob | string): Promise<void> {
    if (!this.__root) { return; }

    const [dirPath, fileName] = this.__separateFileName(path);
    if (!fileName) { return; }

    const targetDir = await this.__ensureDirectoryPath(dirPath, { create: true });
    if (!targetDir) { return; }

    const fileHandle = await targetDir.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();

    this.__emit('save', { path: this.__normalizePath(path) });
  }

  public async delete(path: string): Promise<void> {
    if (!this.__root) { return; }

    const [dirPath, fileName] = this.__separateFileName(path);
    if (!fileName) { return; }

    const targetDir = await this.__ensureDirectoryPath(dirPath, { create: false });
    if (!targetDir) { return; }

    await targetDir.removeEntry(fileName);

    this.__emit('delete', { path: this.__normalizePath(path) });
  }

  public async getFile(path: string): Promise<File | undefined> {
    if (!this.__root) { return undefined; }

    const [dirPath, fileName] = this.__separateFileName(path);
    if (!fileName) { return undefined; }

    const targetDir = await this.__ensureDirectoryPath(dirPath, { create: false });
    if (!targetDir) { return undefined; }

    const fileHandle = await targetDir.getFileHandle(fileName).catch((error) => {
      if (error.name === 'NotFoundError') {
        return undefined;
      } else {
        throw error;
      }
    });

    return await fileHandle?.getFile();
  }

  public async listFiles(path: string): Promise<string[] | undefined> {
    if (!this.__root) { return undefined; }

    const targetDir = await this.__ensureDirectoryPath(path, { create: false });
    if (!targetDir) { return undefined; }

    const files: string[] = [];
    for await (const entry of (targetDir as any).values()) {
      if (entry.kind === 'file') {
        files.push(entry.name);
      }
    }

    return files;
  }

  public async listFilesRecursive(path: string): Promise<string[] | undefined> {
    if (!this.__root) return undefined;

    const targetDir = await this.__ensureDirectoryPath(path, { create: false });
    if (!targetDir) return undefined;

    const files: string[] = [];
    for await (const entry of (targetDir as any).values()) {
      if (entry.kind === 'file') {
        files.push(entry.name);
      } else if (entry.kind === 'directory') {
        const subFiles = await this.listFilesRecursive(`${path}/${entry.name}`);
        if (subFiles) {
          files.push(...subFiles.map((subFile) => `${entry.name}/${subFile}`));
        }
      }
    }

    return files;
  }

  private __separateFileName(path: string): [string, string] {
    const parts = path.split('/');
    const fileName = parts.pop() || '';
    const dirPath = parts.join('/');
    return [dirPath, fileName];
  }

  private __normalizePath(path: string): string {
    const parts = path.split('/').filter(part => part.length > 0);
    return parts.join('/');
  }

  private async __ensureDirectoryPath(path: string, { create = false }: { create?: boolean }): Promise<FileSystemDirectoryHandle | undefined> {
    if (!this.__root) return undefined;

    const parts = path.split('/').filter(part => part.length > 0);
    if (parts.length === 0) return this.__root;

    // Check cache first
    const cached = this.__directoryCache.get(path);
    if (cached != null) {
      return cached;
    }

    let currentDir = this.__root;
    let currentPath = '';

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Check if we have this partial path cached
      if (this.__directoryCache.has(currentPath)) {
        currentDir = this.__directoryCache.get(currentPath)!;
        continue;
      }

      try {
        currentDir = await currentDir.getDirectoryHandle(part, { create });
        // Cache this directory handle
        this.__directoryCache.set(currentPath, currentDir);
      } catch (error) {
        console.warn(`Failed to ${create ? 'create' : 'access'} directory ${part}:`, error);
        return undefined;
      }
    }

    return currentDir;
  }
}
