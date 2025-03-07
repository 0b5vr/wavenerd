import { EventEmittable } from './utils/EventEmittable';
import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';
import { migrateMIDIManagerStorage } from './migrateMIDIManagerStorage';

interface MidiManagerStorageType {
  version?: number;
  values?: { [ key: string ]: number };
  mappings?: { [ key: string ]: string };
}

interface MidiManagerEvents {
  deviceDetect: { deviceId: string; deviceName: string };
  message: { deviceId: string; deviceName: string };
  noteOn: { deviceId: string; deviceName: string; channel: number; note: number; velocity: number; paramKey: string | null };
  noteOff: { deviceId: string; deviceName: string; channel: number; note: number; velocity: number; paramKey: string | null };
  cc: { deviceId: string; deviceName: string; channel: number; cc: number; value: number; paramKey: string | null };
  paramChange: { paramKey: string; value: number; midiKey: string | null };
  mappingAssign: { midiKey: string; paramKey: string };
  mappingUnassign: { midiKey: string };
  learn: { paramKey: string | null };
}

export class MidiManager extends EventEmittable<MidiManagerEvents> {
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

  private __storage: ThrottledJSONStorage<MidiManagerStorageType>;
  private __learningParam: string | null = null;

  public constructor() {
    super();

    migrateMIDIManagerStorage('wavenerd-midiManager');
    this.__storage = new ThrottledJSONStorage('wavenerd-midiManager');

    this.defaultValues = {};

    this.__deviceSet = new Set();

    this.__values = this.__storage.get('values') ?? {};
    this.__mappings = this.__storage.get('mappings') ?? {};
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
      this.__emit('deviceDetect', { deviceId, deviceName });
    });
  }

  public learn(paramKey: string): void {
    this.__learningParam = paramKey;
    this.__emit('learn', { paramKey });
  }

  public clearLearn(): void {
    this.__learningParam = null;
    this.__emit('learn', { paramKey: null });
  }

  public assignMapping(midiKey: string, paramKey: string): void {
    this.__mappings[midiKey] = paramKey;
    this.__storage.set('mappings', this.__mappings);
    this.__emit('mappingAssign', { midiKey, paramKey });
  }

  public unassignMapping(midiKey: string): void {
    delete this.__mappings[midiKey];
    this.__storage.set('mappings', this.__mappings);
    this.__emit('mappingUnassign', { midiKey });
  }

  public setValue(paramKey: string, value: number, midiKey?: string | null): void {
    this.__values[paramKey] = value;

    this.__storage.set('values', this.__values);

    this.__emit('paramChange', {
      paramKey,
      value,
      midiKey: midiKey ?? null,
    });
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
      this.__emit('message', { deviceId, deviceName });

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

        this.__emit('noteOn', { deviceId, deviceName, channel, note, velocity, paramKey });
      } else if (isNoteOff) {
        const note = event.data[1];
        const velocity = event.data[2] / 127.0;
        midiKey = `note-${channel}-${note}`;

        paramKey = this.__mappings[midiKey] ?? null;
        value = 0.0;

        this.__emit('noteOff', { deviceId, deviceName, channel, note, velocity, paramKey });
      } else if (isCC) {
        const cc = event.data[1];
        midiKey = `cc-${channel}-${cc}`;

        if (this.__learningParam) {
          this.assignMapping(midiKey, this.__learningParam);
          this.clearLearn();
        }

        paramKey = this.__mappings[midiKey] ?? null;
        value = Math.max(event.data[2] - 1.0, 0.0) / 126.0;

        this.__emit('cc', { deviceId, deviceName, channel, cc, value, paramKey });
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
