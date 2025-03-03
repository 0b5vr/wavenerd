const VERSION_2024_11_23 = 2024_11_23;
const VERSION_2025_02_11 = 2025_02_11;
const VERSION_LATEST = VERSION_2025_02_11;

const nameMap20241123: Record<string, string> = {
  'XFader': '/mixer/xfader_pos',
  'gainA': '/mixer/channel_a/gain',
  'gainB': '/mixer/channel_b/gain',
  'deckA-knob0': '/deck_a/knob0',
  'deckA-knob1': '/deck_a/knob1',
  'deckA-knob2': '/deck_a/knob2',
  'deckA-knob3': '/deck_a/knob3',
  'deckA-knob4': '/deck_a/knob4',
  'deckA-knob5': '/deck_a/knob5',
  'deckA-knob6': '/deck_a/knob6',
  'deckA-knob7': '/deck_a/knob7',
  'deckB-knob0': '/deck_b/knob0',
  'deckB-knob1': '/deck_b/knob1',
  'deckB-knob2': '/deck_b/knob2',
  'deckB-knob3': '/deck_b/knob3',
  'deckB-knob4': '/deck_b/knob4',
  'deckB-knob5': '/deck_b/knob5',
  'deckB-knob6': '/deck_b/knob6',
  'deckB-knob7': '/deck_b/knob7',
};

function migrate20241123(data: any): any {
  if (data.version != null && data.version >= VERSION_2024_11_23) { return data; }

  // noteMap, 1 ch -> 16 ch
  const prevNoteMap: { [ note: string ]: string } | undefined = data.noteMap;
  const newNoteMap: { [ note: string ]: string }[] = [...Array(16)].map(() => ({}));

  // noteMap, rename keys
  if (prevNoteMap != null) {
    for (const [note, prevKey] of Object.entries(prevNoteMap)) {
      const newKey = nameMap20241123[prevKey] ?? prevKey;
      newNoteMap[0][note] = newKey;
    }
  }

  // ccMap, 1 ch -> 16 ch
  const prevCCMap: { [ cc: string ]: string } | undefined = data.ccMap;
  const newCCMap: { [ cc: string ]: string }[] = [...Array(16)].map(() => ({}));

  // ccMap, rename keys
  if (prevCCMap != null) {
    for (const [cc, prevKey] of Object.entries(prevCCMap)) {
      const newKey = nameMap20241123[prevKey] ?? prevKey;
      newCCMap[0][cc] = newKey;
    }
  }

  // values, rename keys
  const prevValues: { [ key: string ]: number } | undefined = data.values;
  const newValues: { [ key: string ]: number } = {};

  if (prevValues != null) {
    for (const [key, value] of Object.entries(prevValues)) {
      const newKey = nameMap20241123[key] ?? key;
      newValues[newKey] = value;
    }
  }

  return {
    version: VERSION_2024_11_23,
    values: newValues,
    noteMap: newNoteMap,
    ccMap: newCCMap,
  };
}

function migrate20250211(data: any): any {
  if (data.version != null && data.version >= VERSION_2025_02_11) { return data; }

  // unify noteMap and ccMap
  const noteMap = data.noteMap;
  const ccMap = data.ccMap;

  const newMappings: { [ key: string ]: string } = {};

  noteMap?.map((chMap: { [ note: string ]: string }, ch: number) => {
    for (const [note, key] of Object.entries(chMap)) {
      newMappings[`note-${ch}-${note}`] = key;
    }
  });

  ccMap?.map((chMap: { [ cc: string ]: string }, ch: number) => {
    for (const [cc, key] of Object.entries(chMap)) {
      newMappings[`cc-${ch}-${cc}`] = key;
    }
  });

  return {
    version: VERSION_2025_02_11,
    values: data.values,
    mappings: newMappings,
  };
}

export function migrateMIDIManagerStorage(key: string): void {
  const rawData = localStorage.getItem(key);
  let data = rawData ? JSON.parse(rawData) : { version: VERSION_LATEST };

  data = migrate20241123(data);
  data = migrate20250211(data);

  localStorage.setItem(key, JSON.stringify(data));
}
