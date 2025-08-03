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

export function migrateSettingsManagerStorage(key: string): void {
  const rawData = localStorage.getItem(key);
  let data = rawData ? JSON.parse(rawData) : { version: VERSION_LATEST };

  data = migrate20250304(data);

  localStorage.setItem(key, JSON.stringify(data));
}
