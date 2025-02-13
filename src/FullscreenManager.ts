import { EventEmittable } from './utils/EventEmittable';

interface FullscreenManagerEvents {
  fullscreenChange: { isFullscreen: boolean };
}

export class FullscreenManager extends EventEmittable<FullscreenManagerEvents> {
  private __isFullscreen = false;

  public get isFullscreen() {
    return this.__isFullscreen;
  }

  public constructor() {
    super();

    document.addEventListener('fullscreenchange', () => {
      this.__isFullscreen = document.fullscreenElement != null;
      this.__emit('fullscreenChange', { isFullscreen: this.__isFullscreen });

      if (this.__isFullscreen) {
        navigator.keyboard?.lock();
      }
    });
  }

  public requestFullscreen() {
    document.body.requestFullscreen();
  }

  public exitFullscreen() {
    document.exitFullscreen();
  }
}
