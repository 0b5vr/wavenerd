/**
 * Convert stereo Float32Array PCM samples to a 16-bit WAV ArrayBuffer.
 *
 * @param src - Tuple of [left, right] channel samples in [-1.0, 1.0]. Both arrays must have the same length.
 * @param sampleRate - Sample rate in Hz (e.g. 44100, 48000)
 * @returns ArrayBuffer of the complete WAV file (interleaved stereo, 16-bit PCM)
 */
export function convertF32RawToS16Wav(src: [Float32Array, Float32Array], sampleRate: number): ArrayBuffer {
  const numSamples = src[0].length;
  const dataChunkSize = 4 * numSamples; // 2 channels * 2 bytes
  const byteLength = 44 + dataChunkSize;
  const array = new Uint8Array(byteLength);

  let head = 0;

  // 'RIFF'
  array[head++] = 0x52;
  array[head++] = 0x49;
  array[head++] = 0x46;
  array[head++] = 0x46;

  // chunk size
  const riffChunkSize = byteLength - 8;
  array[head++] = (riffChunkSize) & 255;
  array[head++] = (riffChunkSize >> 8) & 255;
  array[head++] = (riffChunkSize >> 16) & 255;
  array[head++] = (riffChunkSize >> 24) & 255;

  // 'WAVE'
  array[head++] = 0x57;
  array[head++] = 0x41;
  array[head++] = 0x56;
  array[head++] = 0x45;

  // 'fmt '
  array[head++] = 0x66;
  array[head++] = 0x6d;
  array[head++] = 0x74;
  array[head++] = 0x20;

  // chunk size
  array[head++] = 16;
  array[head++] = 0;
  array[head++] = 0;
  array[head++] = 0;

  // format tag
  array[head++] = 1;
  array[head++] = 0;

  // channels
  array[head++] = 2;
  array[head++] = 0;

  // samples per sec
  array[head++] = (sampleRate) & 255;
  array[head++] = (sampleRate >> 8) & 255;
  array[head++] = (sampleRate >> 16) & 255;
  array[head++] = (sampleRate >> 24) & 255;

  // avg bytes per sec (2ch * 2bytes * sampleRate)
  const byteRate = 4 * sampleRate;
  array[head++] = (byteRate) & 255;
  array[head++] = (byteRate >> 8) & 255;
  array[head++] = (byteRate >> 16) & 255;
  array[head++] = (byteRate >> 24) & 255;

  // block align (2ch * 2bytes)
  array[head++] = 4;
  array[head++] = 0;

  // bits per sample
  array[head++] = 16;
  array[head++] = 0;

  // 'data'
  array[head++] = 0x64;
  array[head++] = 0x61;
  array[head++] = 0x74;
  array[head++] = 0x61;

  // chunk size
  array[head++] = (dataChunkSize) & 255;
  array[head++] = (dataChunkSize >> 8) & 255;
  array[head++] = (dataChunkSize >> 16) & 255;
  array[head++] = (dataChunkSize >> 24) & 255;

  // interleaved L, R
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < 2; ch++) {
      let data = Math.min(Math.max(Math.floor(src[ch][i] * 32768.0), -32768), 32767);
      data = data < 0 ? (data + 65536) : data;

      array[head++] = (data) & 255;
      array[head++] = (data >> 8) & 255;
    }
  }

  return array.buffer;
}
