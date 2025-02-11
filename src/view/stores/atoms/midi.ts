import { atom } from 'jotai';

export const midiParamsAtom = atom<Record<string, number>>({});
export const midiDevicesAtom = atom<{ deviceId: string; deviceName: string }[]>([]);
export const midiMappingsAtom = atom<Record<string, string>>({});

export const midiIndicatorAtom = atom(false);

export const midiLearningAtom = atom<string | null>(null);

// == derived atoms ================================================================================
export const midiDevicesSortedAtom = atom((get) => {
  const devices = get(midiDevicesAtom);
  return devices.sort((a, b) => a.deviceName.localeCompare(b.deviceName));
});

function midiKeyToNumber(key: string): number {
  const splitted = key.split('-');

  let value = 0;

  value += splitted[0] === 'note' ? 0 : 2048;
  value += parseInt(splitted[1]) * 128;
  value += parseInt(splitted[2]);

  return value;
}

export const midiMappingsSortedAtom = atom((get) => {
  const mappings = get(midiMappingsAtom);

  return Object.entries(mappings).sort((a, b) => {
    const aNum = midiKeyToNumber(a[0]);
    const bNum = midiKeyToNumber(b[0]);

    return aNum - bNum;
  });
});
