import { Observable } from './utils/Observable';
import { ClockRealtime } from '@0b5vr/experimental';

interface FrameEmitterUpdateEvent {
  time: number;
  deltaTime: number;
}

export class FrameEmitter {
  private _clock: ClockRealtime;

  public readonly onUpdate = new Observable<FrameEmitterUpdateEvent>();

  constructor() {
    this._clock = new ClockRealtime();
    this._clock.play();

    requestAnimationFrame(() => this.emitFrame());
  }

  public emitFrame() {
    requestAnimationFrame(() => this.emitFrame());

    this._clock.update();
    const { time, deltaTime } = this._clock;

    this.onUpdate.notify({ time, deltaTime });
  }
}
