import { EventEmittable } from './utils/EventEmittable';
import { MixerEQMode } from './MixerChannel';
import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';

export type XFaderModeType = 'constantPower' | 'cut' | 'linear' | 'transition';

export type VectorscopeModeType = 'none' | 'line' | 'points';

export type SpectrumModeType = 'none' | 'line';

export interface Settings {
  latencyBlocks: number;
  channelRouting: string;
  masterDCRemoval: boolean;
  masterReverbGain: number;
  xfaderMode: XFaderModeType;
  eqMode: MixerEQMode;
  vectorscopeMode: VectorscopeModeType;
  vectorscopeOpacity: number;
  vectorscopeColor: string;
  spectrumMode: SpectrumModeType;
  spectrumOpacity: number;
  spectrumColor: string;
  theme: string;
  editorFont: string;
  editorFontVariantLigatures: string;
  editorLogEnabled: boolean;
}

export const defaultSettings: Settings = {
  latencyBlocks: 32,
  channelRouting: 'master:0,master:1,cue:0,cue:1',
  masterDCRemoval: true,
  masterReverbGain: 0.0,
  xfaderMode: 'transition',
  eqMode: 'none',
  vectorscopeMode: 'none',
  vectorscopeOpacity: 0.2,
  vectorscopeColor: '#ffffff',
  spectrumMode: 'none',
  spectrumOpacity: 0.2,
  spectrumColor: '#ffffff',
  theme: 'monokaiSharp',
  editorFont: '12px "Roboto Mono", monospace',
  editorFontVariantLigatures: 'normal',
  editorLogEnabled: false,
};

interface SettingsManagerEvents {
  change: Partial<Settings>;
}

export class SettingsManager extends EventEmittable<SettingsManagerEvents> {
  public get values(): Settings {
    return {
      ...defaultSettings,
      ...this.__storage.values,
    };
  }

  public set(key: keyof Settings, value: Settings[ keyof Settings ]): void {
    this.__storage.set(key, value);
    this.__emit('change', { [key]: value });
  }

  private __storage: ThrottledJSONStorage<Settings>;

  public constructor() {
    super();

    this.__storage = new ThrottledJSONStorage('wavenerd-settings');
  }
}

export const SETTINGSMAN = new SettingsManager();
