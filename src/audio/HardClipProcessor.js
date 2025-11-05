class HardClipProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const inputChannels = inputs?.[0];
    const outputChannels = outputs?.[0];

    if (inputChannels == null || outputChannels == null || inputChannels.length === 0 || outputChannels.length === 0) {
      return true;
    }

    const channelCount = Math.min(inputChannels.length, outputChannels.length);

    for (let channel = 0; channel < channelCount; channel++) {
      const input = inputChannels[channel];
      const output = outputChannels[channel];
      if (input == null || output == null) { continue; }

      const frameCount = input.length;

      for (let i = 0; i < frameCount; i++) {
        const sample = input[i];
        if (sample > 1.0) {
          output[i] = 1.0;
        } else if (sample < -1.0) {
          output[i] = -1.0;
        } else {
          output[i] = sample;
        }
      }
    }

    return true;
  }
}

registerProcessor('hard-clip-processor', HardClipProcessor);
