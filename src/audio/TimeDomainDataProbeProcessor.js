const BANK_SIZE = 65536;
const BLOCK_SIZE = 128;

class TimeDomainDataProbeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.head = 0;
    this.bank = [];

    this.port.onmessage = () => this.cashout();
  }

  /**
   * @param {Float32Array[][]} inputs
   */
  process(inputs) {
    const data = inputs?.[0];
    if (data == null) {
      return true;
    }

    if (this.head + BLOCK_SIZE > BANK_SIZE) {
      this.cashout();
    }

    for (let iCh = 0; iCh < data.length; iCh++) {
      if (this.bank[iCh] == null) {
        this.bank[iCh] = new Float32Array(BANK_SIZE);
      }

      this.bank[iCh].set(data[iCh], this.head);
    }

    this.head += BLOCK_SIZE;

    return true;
  }

  cashout() {
    this.port.postMessage(
      this.bank.map((ch) => ch.subarray(0, this.head)),
    );
    this.head = 0;
  }
}

registerProcessor('time-domain-data-probe-processor', TimeDomainDataProbeProcessor);
