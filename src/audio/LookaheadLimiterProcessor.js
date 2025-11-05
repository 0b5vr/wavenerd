const BLOCK_SIZE = 128;

/**
 * The implementation of lookahead limiter.
 *
 * Ref: https://www.musicdsp.org/en/latest/Effects/274-lookahead-limiter.html
 */
class LookaheadLimiterProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    /** Release time in seconds. */
    this.release = 0.1;

    /** Head index for circular buffer. */
    this._head = 0;

    /** Current gain reduction factor. */
    this._factor = 0.0;

    /** Input buffers for each channel. */
    this._buffersInput = [new Float32Array(BLOCK_SIZE * 2), new Float32Array(BLOCK_SIZE * 2)];

    /** The buffer used for input of peak hold. */
    this._bufferAbs = new Float32Array(BLOCK_SIZE * 2);

    /** The moving average buffer (1st.) */
    this._bufferMA1 = new Float32Array(BLOCK_SIZE);

    /** The sum of bufferMA1 values. */
    this._sumMA1 = 0.0;

    /** The moving average buffer (2nd.) */
    this._bufferMA2 = new Float32Array(BLOCK_SIZE);

    /** The sum of bufferMA2 values. */
    this._sumMA2 = 0.0;

    /** The maximum input level observed. */
    this._peak = 0.0;

    /** The index of the peak. */
    this._iPeak = 0;
  }

  process(inputs, outputs) {
    const inputChannels = inputs?.[0];
    const outputChannels = outputs?.[0];

    if (inputChannels == null || outputChannels == null || inputChannels.length === 0 || outputChannels.length === 0) {
      return true;
    }

    for (let i = 0; i < BLOCK_SIZE; i++) {
      // update peak level
      this._bufferAbs[this._head + i] = Math.max(
        Math.abs(inputChannels[0][i]),
        Math.abs(inputChannels[1][i]),
      );

      // peak hold
      if (this._iPeak === this._head + i) {
        // naive implementation :P
        this._peak = 0.0;
        for (let j = 0; j < BLOCK_SIZE * 2; j++) {
          if (this._bufferAbs[j] > this._peak) {
            this._peak = this._bufferAbs[j];
            this._iPeak = j;
          }
        }
      }

      if (this._bufferAbs[this._head + i] > this._peak) {
        this._peak = this._bufferAbs[this._head + i];
        this._iPeak = this._head + i;
      }

      // calc gain reduction factor
      let factor = Math.min(1.0 / this._peak, 1.0);
      factor = 1.0 - factor; // for better numerical stability on small values

      // calc moving average
      this._sumMA1 += factor - this._bufferMA1[i];
      this._bufferMA1[i] = factor;
      factor = this._sumMA1 / BLOCK_SIZE;

      this._sumMA2 += factor - this._bufferMA2[i];
      this._bufferMA2[i] = factor;
      factor = this._sumMA2 / BLOCK_SIZE;

      // apply release
      const releaseCoeff = Math.exp(-1.0 / (sampleRate * this.release));
      this._factor = Math.max(factor, this._factor * releaseCoeff);

      factor = 1.0 - this._factor;

      // apply gain reduction
      outputChannels[0][i] = this._buffersInput[0][this._head + i] * factor;
      outputChannels[1][i] = this._buffersInput[1][this._head + i] * factor;

      // store new input samples in circular buffer
      this._buffersInput[0][this._head + i] = inputChannels[0][i];
      this._buffersInput[1][this._head + i] = inputChannels[1][i];
    }

    this._head = (this._head + BLOCK_SIZE) % (BLOCK_SIZE * 2);

    return true;
  }
}

registerProcessor('lookahead-limiter-processor', LookaheadLimiterProcessor);
