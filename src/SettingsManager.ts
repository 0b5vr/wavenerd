import { EventEmittable } from './utils/EventEmittable';
import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';

export type XFaderModeType = 'constantPower' | 'cut' | 'linear' | 'transition';

export type VectorscopeModeType = 'none' | 'line' | 'points';

export type SpectrumModeType = 'none' | 'line';

export interface Settings {
  latencyBlocks: number;
  masterReverbGain: number;
  xfaderMode: XFaderModeType;
  vectorscopeMode: VectorscopeModeType;
  vectorscopeOpacity: number;
  vectorscopeColor: string;
  spectrumMode: SpectrumModeType;
  spectrumOpacity: number;
  spectrumColor: string;
  theme: string;
  editorFont: string;
}

export const defaultSettings: Settings = {
  latencyBlocks: 32,
  masterReverbGain: 0.0,
  xfaderMode: 'transition',
  vectorscopeMode: 'none',
  vectorscopeOpacity: 0.2,
  vectorscopeColor: '#ffffff',
  spectrumMode: 'none',
  spectrumOpacity: 0.2,
  spectrumColor: '#ffffff',
  theme: 'monokaiSharp',
  editorFont: '12px "Roboto Mono", monospace',
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

  public set( key: keyof Settings, value: Settings[ keyof Settings ] ): void {
    this.__storage.set( key, value );
    this.__emit( 'change', { [ key ]: value } );
  }

  private __storage: ThrottledJSONStorage<Settings>;

  public constructor() {
    super();

    this.__storage = new ThrottledJSONStorage( 'wavenerd-settings' );
  }
}

export const SETTINGSMAN = new SettingsManager();
