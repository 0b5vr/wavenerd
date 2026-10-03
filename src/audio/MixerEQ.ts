import { Observable } from '../utils/Observable';

export interface MixerEQChangeEvent {
  low?: number;
  mid?: number;
  high?: number;
}

export abstract class MixerEQ {
  public abstract get high(): number;
  public abstract set high(value: number);
  public abstract get mid(): number;
  public abstract set mid(value: number);
  public abstract get low(): number;
  public abstract set low(value: number);

  public abstract get input(): AudioNode;
  public abstract get output(): AudioNode;

  public readonly onChange = new Observable<MixerEQChangeEvent>();
}
