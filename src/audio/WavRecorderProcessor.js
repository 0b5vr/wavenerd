const CHUNK_SIZE = 16384;

class WavRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this._isRecording = true;
    this._writePos = 0;
    this._bufL = new Float32Array(CHUNK_SIZE);
    this._bufR = new Float32Array(CHUNK_SIZE);

    this.port.onmessage = ({ data }) => {
      if (data.type === 'stop') {
        this._isRecording = false;
      }
    };
  }

  process(inputs) {
    if (!this._isRecording) {
      return true;
    }

    const ch = inputs[0];
    if (!ch || ch.length === 0) {
      return true;
    }

    const [inL, inR] = ch;
    const frameCount = inL.length;

    let srcOffset = 0;
    while (srcOffset < frameCount) {
      const space = CHUNK_SIZE - this._writePos;
      const toCopy = Math.min(space, frameCount - srcOffset);

      this._bufL.set(inL.subarray(srcOffset, srcOffset + toCopy), this._writePos);
      this._bufR.set(inR.subarray(srcOffset, srcOffset + toCopy), this._writePos);
      this._writePos += toCopy;
      srcOffset += toCopy;

      if (this._writePos >= CHUNK_SIZE) {
        const l = this._bufL;
        const r = this._bufR;
        this.port.postMessage({ type: 'chunk', l, r }, [l.buffer, r.buffer]);
        this._bufL = new Float32Array(CHUNK_SIZE);
        this._bufR = new Float32Array(CHUNK_SIZE);
        this._writePos = 0;
      }
    }

    return true;
  }
}

registerProcessor('wav-recorder-processor', WavRecorderProcessor);
