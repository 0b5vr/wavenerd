const BLOCK_SIZE = 128;
const CHANNELS = 2;

class DCRemovalProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.dc = [...Array(CHANNELS)].map(() => 0);
  }

  process(inputs, outputs) {
    if (inputs?.[0].length === 0 || outputs?.[0].length === 0) {
      return true;
    }

    const k = Math.min(1.0 / sampleRate, 1.0);

    for (let iChannel = 0; iChannel < CHANNELS; iChannel++) {
      const input = inputs[0][iChannel];
      const output = outputs[0][iChannel];

      let dc = this.dc[iChannel];
      for (let i = 0; i < BLOCK_SIZE; i++) {
        const x = input[i];
        output[i] = x - dc;
        dc += (x - dc) * k;
      }
      this.dc[iChannel] = dc;
    }

    return true;
  }
}

registerProcessor('dc-removal-processor', DCRemovalProcessor);
