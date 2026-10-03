import { Observable } from './utils/Observable';
import { migrateMIDIManagerStorage, MIDI_VERSION_LATEST } from './migrateMIDIManagerStorage';
import { type StorageManager } from './StorageManager';
import { throttle } from 'throttle-debounce';

export interface MidiManagerStorageType {
  version?: number;
  values?: { [ key: string ]: number };
  mappings?: { [ key: string ]: string };
}

interface MidiDeviceEvent {
  deviceId: string;
  deviceName: string;
}

interface MidiNoteEvent extends MidiDeviceEvent {
  channel: number;
  note: number;
  velocity: number;
  paramKey: string | null;
}

interface MidiCCEvent extends MidiDeviceEvent {
  channel: number;
  cc: number;
  value: number;
  paramKey: string | null;
}

interface MidiParamChangeEvent {
  paramKey: string;
  value: number;
  midiKey: string | null;
}

interface MidiMappingAssignEvent {
  midiKey: string;
  paramKey: string;
}

interface MidiMappingUnassignEvent {
  midiKey: string;
}

interface MidiLearnEvent {
  paramKey: string | null;
}

export class MidiManager {
  private __deviceSet: Set<{ deviceId: string; deviceName: string }>;
  public get deviceSet(): Set<{ deviceId: string; deviceName: string }> {
    return this.__deviceSet;
  }

  private __values: { [ paramKey: string ]: number };
  public get values(): { [ paramKey: string ]: number } {
    return {
      ...this.defaultValues,
      ...this.__values,
    };
  }

  public defaultValues: { [ paramKey: string ]: number };

  private __mappings: { [ midiKey: string ]: string };
  public get mappings(): { [ midiKey: string ]: string } {
    return this.__mappings;
  }

  private __learningParam: string | null = null;

  private __throttledSave?: () => void;

  public readonly onDeviceDetect = new Observable<MidiDeviceEvent>();
  public readonly onMessage = new Observable<MidiDeviceEvent>();
  public readonly onNoteOn = new Observable<MidiNoteEvent>();
  public readonly onNoteOff = new Observable<MidiNoteEvent>();
  public readonly onCC = new Observable<MidiCCEvent>();
  public readonly onParamChange = new Observable<MidiParamChangeEvent>();
  public readonly onMappingAssign = new Observable<MidiMappingAssignEvent>();
  public readonly onMappingUnassign = new Observable<MidiMappingUnassignEvent>();
  public readonly onLearn = new Observable<MidiLearnEvent>();
  public readonly onInitStorage = new Observable();

  public constructor() {
    this.defaultValues = {};

    this.__deviceSet = new Set();

    this.__values = {};
    this.__mappings = {};
  }

  public async initStorage(storageManager: StorageManager): Promise<void> {
    const data = await migrateMIDIManagerStorage(storageManager);

    this.__values = data.values ?? {};
    this.__mappings = data.mappings ?? {};

    this.onInitStorage.notify();

    this.__throttledSave = throttle(1000, async () => {
      const rawData = JSON.stringify({
        version: MIDI_VERSION_LATEST,
        values: this.__values,
        mappings: this.__mappings,
      });
      await storageManager.save('midi.json', rawData);
    });
  }

  public midi(key: string): number {
    return this.values[key] ?? 0.0;
  }

  public async initMidi(): Promise<void> {
    const access = await navigator.requestMIDIAccess();

    const inputs = access.inputs;
    Array.from(inputs.values()).forEach((input) => {
      const deviceId = input.id;
      const deviceName = input.name ?? `Unknown (${deviceId})`;

      input.addEventListener(
        'midimessage',
        (event) => this.__handleMidiMessage(event, deviceId, deviceName),
      );

      this.__deviceSet.add({ deviceId, deviceName });
      this.onDeviceDetect.notify({ deviceId, deviceName });
    });
  }

  public learn(paramKey: string): void {
    this.__learningParam = paramKey;
    this.onLearn.notify({ paramKey });
  }

  public clearLearn(): void {
    this.__learningParam = null;
    this.onLearn.notify({ paramKey: null });
  }

  public assignMapping(midiKey: string, paramKey: string): void {
    this.__mappings[midiKey] = paramKey;
    this.onMappingAssign.notify({ midiKey, paramKey });
    this.__throttledSave?.();
  }

  public unassignMapping(midiKey: string): void {
    delete this.__mappings[midiKey];
    this.onMappingUnassign.notify({ midiKey });
    this.__throttledSave?.();
  }

  public setValue(paramKey: string, value: number, midiKey?: string | null): void {
    this.__values[paramKey] = value;
    this.onParamChange.notify({
      paramKey,
      value,
      midiKey: midiKey ?? null,
    });
    this.__throttledSave?.();
  }

  private __handleMidiMessage(
    event: WebMidi.MIDIMessageEvent,
    deviceId: string,
    deviceName: string,
  ): void {
    let paramKey: string | null = null;
    let midiKey: string | null = null;
    let value = 0;

    if (event.data) {
      this.onMessage.notify({ deviceId, deviceName });

      const isNoteOff = event.data[0] >= 128 && event.data[0] <= 143;
      const isNoteOn = event.data[0] >= 144 && event.data[0] <= 159;
      const isCC = event.data[0] >= 176 && event.data[0] <= 191;

      const channel = event.data[0] % 16;

      if (isNoteOn) {
        const note = event.data[1];
        const velocity = event.data[2] / 127.0;
        midiKey = `note-${channel}-${note}`;

        if (this.__learningParam) {
          this.assignMapping(midiKey, this.__learningParam);
          this.clearLearn();
        }

        paramKey = this.__mappings[midiKey] ?? null;
        value = velocity;

        this.onNoteOn.notify({ deviceId, deviceName, channel, note, velocity, paramKey });
      } else if (isNoteOff) {
        const note = event.data[1];
        const velocity = event.data[2] / 127.0;
        midiKey = `note-${channel}-${note}`;

        paramKey = this.__mappings[midiKey] ?? null;
        value = 0.0;

        this.onNoteOff.notify({ deviceId, deviceName, channel, note, velocity, paramKey });
      } else if (isCC) {
        const cc = event.data[1];
        midiKey = `cc-${channel}-${cc}`;

        if (this.__learningParam) {
          this.assignMapping(midiKey, this.__learningParam);
          this.clearLearn();
        }

        paramKey = this.__mappings[midiKey] ?? null;
        value = Math.max(event.data[2] - 1.0, 0.0) / 126.0;

        this.onCC.notify({ deviceId, deviceName, channel, cc, value, paramKey });
      }
    }

    if (paramKey) {
      this.setValue(paramKey, value, midiKey);
    }
  }
}

export const MIDIMAN = new MidiManager();
MIDIMAN.defaultValues = {
  '/mixer/xfader_pos': 0.5,

  '/mixer/channel_a/gain': 0.5,
  '/mixer/channel_a/eq/high': 0.5,
  '/mixer/channel_a/eq/mid': 0.5,
  '/mixer/channel_a/eq/low': 0.5,
  '/mixer/channel_a/filter': 0.5,
  '/mixer/channel_a/volume': 1.0,

  '/mixer/channel_b/gain': 0.5,
  '/mixer/channel_b/eq/high': 0.5,
  '/mixer/channel_b/eq/mid': 0.5,
  '/mixer/channel_b/eq/low': 0.5,
  '/mixer/channel_b/filter': 0.5,
  '/mixer/channel_b/volume': 1.0,

  '/mixer/master/volume': 1.0,
};
MIDIMAN.initMidi();
