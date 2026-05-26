import { type RecordingSession } from './RecordingSession';
import { WavRecorderNode } from './WavRecorderNode';
import { convertF32RawToS16Wav } from './float32ArraysToWav';
import { saveBlob } from '../utils/saveBlob';

export class WavRecordingSession implements RecordingSession {
  private __inputNode: AudioNode;
  private __recorderNode: WavRecorderNode;
  private __sampleRate: number;

  public constructor(inputNode: AudioNode, audio: AudioContext) {
    this.__inputNode = inputNode;
    this.__sampleRate = audio.sampleRate;
    this.__recorderNode = new WavRecorderNode(audio);
    inputNode.connect(this.__recorderNode);
  }

  public stop(): void {
    const [left, right] = this.__recorderNode.stop();
    this.__inputNode.disconnect(this.__recorderNode);

    const wav = convertF32RawToS16Wav([left, right], this.__sampleRate);
    const blob = new Blob([wav], { type: 'audio/wav' });
    saveBlob(blob, `wavenerd-${Date.now()}.wav`);
  }
}
