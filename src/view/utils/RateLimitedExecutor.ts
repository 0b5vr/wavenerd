export class RateLimitedExecutor {
  public rateLimit: number;

  private __cue: ( () => void ) | null = null;

  private __lastDate = 0;

  public constructor( rateLimit = 10 ) {
    this.rateLimit = rateLimit;
  }

  public cue( callback: () => void ): void {
    const now = Date.now();
    const delta = this.__lastDate - now + this.rateLimit;
    if ( 0 < delta ) {
      if ( this.__cue === null ) {
        setTimeout( () => {
          this.__cue!();
          this.__cue = null;
          this.__lastDate = Date.now();
        }, delta );
      }
      this.__cue = callback;
    } else {
      callback();
      this.__lastDate = now;
    }
  }
}
