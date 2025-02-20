class TimeDomainDataProbeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs) {
    const data = inputs?.[0];
    if (data == null) {
      return true;
    }

    this.port.postMessage(data);

    return true;
  }
}

registerProcessor('time-domain-data-probe-processor', TimeDomainDataProbeProcessor);
