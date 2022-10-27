import { EventEmittable } from './utils/EventEmittable';
import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';

export type XFaderModeType = 'constantPower' | 'cut' | 'linear' | 'transition';

interface SettingsManagerStorageType {
  latencyBlocks: number;
  xfaderMode: XFaderModeType;
}

interface SettingsManagerEvents {
  changeLatencyBlocks: { blocks: number };
  changeXFaderMode: { mode: XFaderModeType };
}

export class SettingsManager extends EventEmittable<SettingsManagerEvents> {
  public get xfaderMode(): XFaderModeType {
    return this.__storage.get( 'xfaderMode' ) ?? 'transition';
  }
  public set xfaderMode( mode: XFaderModeType ) {
    this.__storage.set( 'xfaderMode', mode );
    this.__emit( 'changeXFaderMode', { mode } );
  }

  public get latencyBlocks(): number {
    return this.__storage.get( 'latencyBlocks' ) ?? 32;
  }
  public set latencyBlocks( blocks: number ) {
    this.__storage.set( 'latencyBlocks', blocks );
    this.__emit( 'changeLatencyBlocks', { blocks } );
  }

  private __storage: ThrottledJSONStorage<SettingsManagerStorageType>;

  public constructor() {
    super();

    this.__storage = new ThrottledJSONStorage( 'wavenerd-settings' );
  }
}

export const SETTINGSMAN = new SettingsManager();
