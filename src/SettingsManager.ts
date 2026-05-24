import { EventEmittable } from './utils/EventEmittable';
import { type MixerEQMode, type MixerFilterMode } from './audio/MixerChannel';
import { type MasterLimiterModeType } from './audio/Mixer';
import { migrateSettingsManagerStorage } from './migrateSettingsManagerStorage';
import { throttle } from 'throttle-debounce';
import { type StorageManager } from './StorageManager';

export type XFaderModeType = 'none' | 'constantPower' | 'cut' | 'linear' | 'transition';

export type VectorscopeModeType = 'none' | 'line' | 'points';
export type SpectrumModeType = 'none' | 'line';
export type OscilloscopeModeType = 'none' | 'line';
export type WaveformModeType = 'none' | 'line';

export interface Settings {
  blocksPerRender: number;
  latencyBlocks: number;
  channelRouting: string;
  masterDCRemoval: boolean;
  masterLimiterMode: MasterLimiterModeType;
  xfaderMode: XFaderModeType;
  eqMode: MixerEQMode;
  filterMode: MixerFilterMode;
  vectorscopeMode: VectorscopeModeType;
  vectorscopeOpacity: number;
  vectorscopeColor: string;
  spectrumMode: SpectrumModeType;
  spectrumOpacity: number;
  spectrumColor: string;
  oscilloscopeMode: OscilloscopeModeType;
  oscilloscopeOpacity: number;
  oscilloscopeColor: string;
  waveformMode: WaveformModeType;
  waveformOpacity: number;
  waveformColor: string;
  theme: string;
  headerItems: string;
  headerIcons: string;
  deckBShow: boolean;
  libraryShow: boolean;
  mixerShow: boolean;
  stalkerShow: boolean;
  preferPixelFonts: boolean;
  editorFont: string;
  editorFontVariantLigatures: string;
  editorGuttersEnabled: boolean;
  editorLogEnabled: boolean;
  editorBraceJumpMapEnabled: boolean;
  editorBraceJumpMapScale: number;
  editorCompileTimeEnabled: boolean;
  recorderFormat: string;
}

export const defaultSettings: Settings = {
  blocksPerRender: 16,
  latencyBlocks: 32,
  channelRouting: 'master:0,master:1,cue:0,cue:1',
  masterDCRemoval: true,
  masterLimiterMode: 'hardClip',
  xfaderMode: 'transition',
  eqMode: 'isolator',
  filterMode: 'biquad',
  vectorscopeMode: 'none',
  vectorscopeOpacity: 0.2,
  vectorscopeColor: '#ffffff',
  spectrumMode: 'none',
  spectrumOpacity: 0.2,
  spectrumColor: '#ffffff',
  oscilloscopeMode: 'none',
  oscilloscopeOpacity: 0.2,
  oscilloscopeColor: '#ffffff',
  waveformMode: 'none',
  waveformOpacity: 0.2,
  waveformColor: '#ffffff',
  theme: 'monokaiSharp',
  headerItems: 'logo,transport,time,beat-number,bpm,nudge',
  headerIcons: 'recorder,midi,settings,help,github',
  deckBShow: true,
  libraryShow: true,
  mixerShow: true,
  stalkerShow: true,
  preferPixelFonts: false,
  editorFont: '14px/18px "Roboto Mono", monospace',
  editorFontVariantLigatures: 'normal',
  editorGuttersEnabled: true,
  editorLogEnabled: false,
  editorBraceJumpMapEnabled: true,
  editorBraceJumpMapScale: 0.8,
  editorCompileTimeEnabled: true,
  recorderFormat: 'wav',
};

interface SettingsManagerEvents {
  change: Partial<Settings>;
  initStorage: void;
}

export class SettingsManager extends EventEmittable<SettingsManagerEvents> {
  private __values: Settings;
  public get values(): Settings {
    return this.__values;
  }

  private __throttledSave?: () => void;

  public constructor() {
    super();

    this.__values = structuredClone(defaultSettings);
  }

  public async initStorage(storageManager: StorageManager): Promise<void> {
    this.__values = {
      ...this.__values,
      ...(await migrateSettingsManagerStorage(storageManager)),
    };

    this.__emit('initStorage');

    this.__throttledSave = throttle(1000, async () => {
      const rawData = JSON.stringify(this.__values);
      await storageManager.save('settings.json', rawData);
    });
  }

  public set<TKey extends keyof Settings>(key: TKey, value: Settings[TKey]): void {
    this.__values[key] = value;
    this.__emit('change', { [key]: value });
    this.__throttledSave?.();
  }
}

export const SETTINGSMAN = new SettingsManager();
