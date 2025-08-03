class FirstOrderFilterProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: 'frequency',
      defaultValue: 350,
      minValue: 20,
      maxValue: 20000,
      automationRate: 'a-rate',
    }];
  }

  constructor() {
    super();

    this._x1 = [0, 0];
    this._y1 = [0, 0];
    this._type = 'lowpass';

    this.port.onmessage = (ev) => {
      const { type, value } = ev.data;
      if (type === 'setType') {
        this._type = value;
      }
    };
  }

  _calculateCoefficients(cutoffFreq) {
    // Coefficients for bilinear transform
    const n = Math.tan(Math.PI * (cutoffFreq / sampleRate));
    const norm = 1.0 / (1.0 + n);

    // Coefficients change based on filter type
    let a0, a1;
    if (this._type === 'lowpass') {
      a0 = a1 = n * norm;
    } else { // highpass
      a0 = norm;
      a1 = -norm;
    }
    const b1 = (n - 1.0) * norm;

    return [a0, a1, b1];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const frequency = parameters.frequency;

    let cutoffFreq = frequency[0];

    for (let ch = 0; ch < input.length; ch++) {
      const inputChannel = input[ch];
      const outputChannel = output[ch];

      for (let i = 0; i < inputChannel.length; i++) {
        if (frequency.length > 1) {
          cutoffFreq = frequency[i];
        }
        const [a0, a1, b1] = this._calculateCoefficients(cutoffFreq);

        // Apply filter
        const x = inputChannel[i];
        const y = a0 * x + a1 * this._x1[ch] - b1 * this._y1[ch];

        // Store states for next sample
        this._x1[ch] = x;
        this._y1[ch] = y;

        outputChannel[i] = y;
      }
    }

    return true;
  }
}

registerProcessor('first-order-filter-processor', FirstOrderFilterProcessor);
