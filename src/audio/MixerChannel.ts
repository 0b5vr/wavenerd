import { MixerEQ, MixerEQChangeEvent } from './MixerEQ';
import { EventEmittable } from '../utils/EventEmittable';
import { MixerEQIsolator } from './MixerEQIsolator';
import { MixerEQNone } from './MixerEQNone';
import { MixerFilter, MixerFilterChangeEvent } from './MixerFilter';
import { MixerFilterNone } from './MixerFilterNone';
import { MixerFilterBiquad } from './MixerFilterBiquad';
import { LINEAR_RAMP_TIME } from './constants';
import { MixerFilterGate } from './MixerFilterGate';

export type MixerEQMode = 'none' | 'isolator';
export type MixerFilterMode = 'none' | 'biquad' | 'gate';

export interface MixerChannelChangeEvent {
  gain?: number;
  eq?: MixerEQChangeEvent;
  eqMode?: MixerEQMode;
  filter?: MixerFilterChangeEvent;
  filterMode?: MixerFilterMode;
  volume?: number;
}

interface MixerChannelEvents {
  change: MixerChannelChangeEvent;
}

export class MixerChannel extends EventEmittable<MixerChannelEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __gain = 1.0;
  public get gain(): number {
    return this.__gain;
  }

  public set gain(value: number) {
    this.__gain = value;

    const time = this.__audio.currentTime + LINEAR_RAMP_TIME;
    this.__gainNode.gain.linearRampToValueAtTime(this.__gain, time);

    this.__emit('change', { gain: value });
  }

  private __volume = 1.0;
  public get volume(): number {
    return this.__volume;
  }

  public set volume(value: number) {
    this.__volume = value;

    const time = this.__audio.currentTime + LINEAR_RAMP_TIME;
    this.__gainNodeOut.gain.linearRampToValueAtTime(this.__volume, time);

    this.__emit('change', { volume: value });
  }

  private __eq: MixerEQ;
  public get eq(): MixerEQ {
    return this.__eq;
  }

  private __eqChangeHandler: (event: MixerEQChangeEvent) => void;

  private __filter: MixerFilter;
  public get filter(): MixerFilter {
    return this.__filter;
  }

  private __filterChangeHandler: (event: MixerFilterChangeEvent) => void;

  private __gainNode: GainNode;
  private __gainNodeOut: GainNode;
  private __gainNodeOutForAnal: GainNode;

  public get input(): AudioNode {
    return this.__gainNode;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  public get outputForAnal(): AudioNode {
    return this.__gainNodeOutForAnal;
  }

  public constructor(audio: AudioContext) {
    super();

    this.__audio = audio;

    this.__gainNode = audio.createGain();
    this.__gainNodeOut = audio.createGain();
    this.__gainNodeOutForAnal = audio.createGain();

    this.__eq = new MixerEQNone(audio);

    this.__eqChangeHandler = this.__eq.on('change', (event) => (
      this.__emit('change', { eq: event })
    ));

    this.__filter = new MixerFilterNone(audio);

    this.__filterChangeHandler = this.__filter.on('change', (event) => (
      this.__emit('change', { filter: event })
    ));

    this.__gainNode.connect(this.__eq.input);
    this.__eq.output.connect(this.__filter.input);
    this.__filter.output.connect(this.__gainNodeOut);
    this.__filter.output.connect(this.__gainNodeOutForAnal);
  }

  public replaceEQ(mode: MixerEQMode): void {
    const { low, mid, high } = this.__eq;

    this.__eq.off('change', this.__eqChangeHandler);

    this.__gainNode.disconnect();
    this.__eq.output.disconnect();

    if (mode === 'none') {
      this.__eq = new MixerEQNone(this.__audio);
    } else if (mode === 'isolator') {
      this.__eq = new MixerEQIsolator(this.__audio);
    }

    this.__eq.low = low;
    this.__eq.mid = mid;
    this.__eq.high = high;

    this.__eqChangeHandler = this.__eq.on('change', (event) => (
      this.__emit('change', { eq: event })
    ));

    this.__gainNode.connect(this.__eq.input);
    this.__eq.output.connect(this.__filter.input);
  }

  public replaceFilter(mode: MixerFilterMode): void {
    const { filter } = this.__filter;

    this.__filter.off('change', this.__filterChangeHandler);

    this.__eq.output.disconnect();
    this.__filter.output.disconnect();

    if (mode === 'none') {
      this.__filter = new MixerFilterNone(this.__audio);
    } else if (mode === 'biquad') {
      this.__filter = new MixerFilterBiquad(this.__audio);
    } else if (mode === 'gate') {
      this.__filter = new MixerFilterGate(this.__audio);
    }

    this.__filter.filter = filter;

    this.__filterChangeHandler = this.__filter.on('change', (event) => (
      this.__emit('change', { filter: event })
    ));

    this.__eq.output.connect(this.__filter.input);
    this.__filter.output.connect(this.__gainNodeOut);
    this.__filter.output.connect(this.__gainNodeOutForAnal);
  }
}
