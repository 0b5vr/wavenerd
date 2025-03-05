import { EventEmittable } from '../utils/EventEmittable';

export interface MixerFilterChangeEvent {
  filter?: number;
}

interface MixerFilterEvents {
  change: MixerFilterChangeEvent;
}

export abstract class MixerFilter extends EventEmittable<MixerFilterEvents> {
  public abstract get filter(): number;
  public abstract set filter(value: number);

  public abstract get input(): AudioNode;
  public abstract get output(): AudioNode;
}
