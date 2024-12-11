import { EventEmittable } from '../utils/EventEmittable';

export interface MixerEQChangeEvent {
  low?: number;
  mid?: number;
  high?: number;
}

interface MixerEQEvents {
  change: MixerEQChangeEvent;
}

export abstract class MixerEQ extends EventEmittable<MixerEQEvents> {
  public abstract get high(): number;
  public abstract set high(value: number);
  public abstract get mid(): number;
  public abstract set mid(value: number);
  public abstract get low(): number;
  public abstract set low(value: number);

  public abstract get input(): AudioNode;
  public abstract get output(): AudioNode;
}
