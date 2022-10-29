import { EventEmittable } from './utils/EventEmittable';
import { ThrottledJSONStorage } from './utils/ThrottledJSONStorage';

export type XFaderModeType = 'constantPower' | 'cut' | 'linear' | 'transition';

export type VectorscopeModeType = 'none' | 'line' | 'points';

interface SettingsManagerStorageType {
  latencyBlocks: number;
  xfaderMode: XFaderModeType;
  vectorscopeMode: VectorscopeModeType;
  vectorscopeOpacity: number;
  vectorscopeColor: string;
}

interface SettingsManagerEvents {
  changeLatencyBlocks: { blocks: number };
  changeXFaderMode: { mode: XFaderModeType };
  changeVectorscopeMode: { mode: VectorscopeModeType };
  changeVectorscopeOpacity: { opacity: number };
  changeVectorscopeColor: { color: string };
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

  public get vectorscopeMode(): VectorscopeModeType {
    return this.__storage.get( 'vectorscopeMode' ) ?? 'none';
  }
  public set vectorscopeMode( mode: VectorscopeModeType ) {
    this.__storage.set( 'vectorscopeMode', mode );
    this.__emit( 'changeVectorscopeMode', { mode } );
  }

  public get vectorscopeOpacity(): number {
    return this.__storage.get( 'vectorscopeOpacity' ) ?? 0.2;
  }
  public set vectorscopeOpacity( opacity: number ) {
    this.__storage.set( 'vectorscopeOpacity', opacity );
    this.__emit( 'changeVectorscopeOpacity', { opacity } );
  }

  public get vectorscopeColor(): string {
    return this.__storage.get( 'vectorscopeColor' ) ?? '#ffffff';
  }
  public set vectorscopeColor( color: string ) {
    this.__storage.set( 'vectorscopeColor', color );
    this.__emit( 'changeVectorscopeColor', { color } );
  }

  private __storage: ThrottledJSONStorage<SettingsManagerStorageType>;

  public constructor() {
    super();

    this.__storage = new ThrottledJSONStorage( 'wavenerd-settings' );
  }
}

export const SETTINGSMAN = new SettingsManager();
