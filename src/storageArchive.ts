import { unzip, zip, type Unzipped, type Zippable } from 'fflate';
import { type StorageManager } from './StorageManager';

const MANIFEST_PATH = 'manifest.json';
const DATA_DIR = 'data/';
const VERSION_2026_10_03 = 2026_10_03;
const ARCHIVE_VERSION_LATEST = VERSION_2026_10_03;

interface ArchiveManifest {
  version: number;
}

function zipAsync(data: Zippable): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    zip(data, (error, result) => error ? reject(error) : resolve(result));
  });
}

function unzipAsync(data: Uint8Array): Promise<Unzipped> {
  return new Promise((resolve, reject) => {
    unzip(data, (error, result) => error ? reject(error) : resolve(result));
  });
}

/**
 * Pack every file in the storage into a zip archive.
 */
export async function exportStorageArchive(storageManager: StorageManager): Promise<Blob> {
  const paths = await storageManager.listFilesRecursive('') ?? [];

  const manifest: ArchiveManifest = {
    version: ARCHIVE_VERSION_LATEST,
  };

  const entries: Zippable = {
    [MANIFEST_PATH]: new TextEncoder().encode(JSON.stringify(manifest, null, 2)),
  };

  for (const path of paths) {
    const file = await storageManager.getFile(path);
    if (file == null) { continue; }
    entries[DATA_DIR + path] = new Uint8Array(await file.arrayBuffer());
  }

  const zipped = await zipAsync(entries);
  return new Blob([zipped as Uint8Array<ArrayBuffer>], { type: 'application/zip' });
}

/**
 * Replace the entire storage with the contents of the given zip archive.
 * All existing files are deleted before writing.
 *
 * The states of the ongoing app won't be updated.
 * Reload the app after calling this.
 */
export async function importStorageArchive(storageManager: StorageManager, archive: Blob): Promise<void> {
  const unzipped = await unzipAsync(new Uint8Array(await archive.arrayBuffer()));

  // check manifest.json
  const manifestData = unzipped[MANIFEST_PATH];
  if (manifestData == null) {
    throw new Error('Invalid archive: manifest.json not found');
  }

  const manifest = JSON.parse(new TextDecoder().decode(manifestData)) as Partial<ArchiveManifest>;
  if (manifest.version == null || manifest.version > ARCHIVE_VERSION_LATEST) {
    throw new Error(`Unsupported archive version: ${manifest.version}`);
  }

  // collect all data files from the unzipped archive
  const files: [string, Uint8Array<ArrayBuffer>][] = [];
  for (const [entryPath, content] of Object.entries(unzipped)) {
    if (!entryPath.startsWith(DATA_DIR) || entryPath.endsWith('/')) { continue; }

    // hello zip slip
    const path = entryPath.slice(DATA_DIR.length);
    if (path.split('/').some((part) => part === '..' || part === '.')) { continue; }

    files.push([path, content as Uint8Array<ArrayBuffer>]);
  }

  // wipe the storage and write the archive contents
  await storageManager.clear();

  for (const [path, content] of files) {
    await storageManager.save(path, content);
  }
}
