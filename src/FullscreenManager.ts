import { Observable } from './utils/Observable';

interface FullscreenChangeEvent {
  isFullscreen: boolean;
}

export class FullscreenManager {
  private __isFullscreen = false;

  public get isFullscreen() {
    return this.__isFullscreen;
  }

  public readonly onFullscreenChange = new Observable<FullscreenChangeEvent>();

  public constructor() {
    document.addEventListener('fullscreenchange', () => {
      this.__isFullscreen = document.fullscreenElement != null;
      this.onFullscreenChange.notify({ isFullscreen: this.__isFullscreen });

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
