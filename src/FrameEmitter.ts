import { ClockRealtime } from '@0b5vr/experimental';
import { EventEmittable } from './utils/EventEmittable';

interface FrameEmitterEvents {
  update: { time: number; deltaTime: number };
}

export class FrameEmitter extends EventEmittable<FrameEmitterEvents> {
  private _clock: ClockRealtime;

  constructor() {
    super();

    this._clock = new ClockRealtime();
    this._clock.play();

    requestAnimationFrame(() => this.emitFrame());
  }

  public emitFrame() {
    requestAnimationFrame(() => this.emitFrame());

    this._clock.update();
    const { time, deltaTime } = this._clock;

    this.__emit('update', { time, deltaTime });
  }
}
