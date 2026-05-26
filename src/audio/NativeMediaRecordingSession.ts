import { type RecordingSession } from './RecordingSession';
import { saveBlob } from '../utils/saveBlob';

interface FormatConfig {
  ext: string;
  mimeType: string;
}

export class NativeMediaRecordingSession implements RecordingSession {
  private __inputNode: AudioNode;
  private __streamDest: MediaStreamAudioDestinationNode;
  private __recorder: MediaRecorder;
  private __chunks: Blob[] = [];

  public constructor(inputNode: AudioNode, audio: AudioContext, config: FormatConfig) {
    this.__inputNode = inputNode;
    this.__streamDest = new MediaStreamAudioDestinationNode(audio);
    inputNode.connect(this.__streamDest);

    this.__recorder = new MediaRecorder(this.__streamDest.stream, {
      mimeType: config.mimeType,
      audioBitsPerSecond: 256 * 1024,
    });

    this.__recorder.addEventListener('dataavailable', (event) => {
      this.__chunks.push(event.data);
    });

    this.__recorder.addEventListener('stop', () => {
      this.__inputNode.disconnect(this.__streamDest);
      const blob = new Blob(this.__chunks, { type: config.mimeType });
      saveBlob(blob, `wavenerd-${Date.now()}.${config.ext}`);
      this.__chunks = [];
    });

    this.__recorder.start();
  }

  public stop(): void {
    this.__recorder.stop();
  }
}
