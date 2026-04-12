import { type Settings } from './SettingsManager';
import { type StorageManager } from './StorageManager';

const VERSION_2025_03_04 = 2025_03_04;
const VERSION_LATEST = VERSION_2025_03_04;

function migrate20250304(data: any): any {
  if (data.version != null && data.version >= VERSION_2025_03_04) { return data; }

  if (data.theme === 'chromaCoder') {
    data.theme = 'chromaCoderGreen';
  }

  return {
    version: VERSION_2025_03_04,
    ...data,
  };
}

export async function migrateSettingsManagerStorage(storageManager: StorageManager): Promise<Settings> {
  // Try loading the settings from the storage manager
  const rawDataFile = await storageManager.getFile('settings.json');
  let rawData = await rawDataFile?.text();

  if (!rawData) {
    // Used to be stored in localStorage
    rawData = localStorage.getItem('wavenerd-settings') ?? undefined;
  }

  if (!rawData) {
    // If no data exists, return default settings
    rawData = JSON.stringify({ version: VERSION_LATEST });
  }

  let data = JSON.parse(rawData);

  data = migrate20250304(data);

  return data;
}
