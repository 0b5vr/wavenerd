import { Observable } from '../utils/Observable';

export interface MixerFilterChangeEvent {
  filter?: number;
}

export abstract class MixerFilter {
  public abstract get filter(): number;
  public abstract set filter(value: number);

  public abstract get input(): AudioNode;
  public abstract get output(): AudioNode;

  public readonly onChange = new Observable<MixerFilterChangeEvent>();
}
