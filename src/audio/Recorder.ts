import { EventEmittable } from '../utils/EventEmittable';
import { saveBlob } from '../utils/saveBlob';

interface RecorderEvents {
  start: void;
  stop: void;
}

export class Recorder extends EventEmittable<RecorderEvents> {
  public readonly audio: AudioContext;

  public get isRecording(): boolean {
    return this.__recorder.state === 'recording';
  }

  private __streamDest: MediaStreamAudioDestinationNode;
  private __recorder: MediaRecorder;
  private __chunks: Blob[] = [];

  public get input(): AudioNode {
    return this.__streamDest;
  }

  public constructor(audio: AudioContext) {
    super();

    this.audio = audio;

    this.__streamDest = new MediaStreamAudioDestinationNode(audio);

    this.__recorder = new MediaRecorder(this.__streamDest.stream, {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 256 * 1024,
    });

    this.__recorder.addEventListener('dataavailable', (event) => {
      this.__chunks.push(event.data);
    });

    this.__recorder.addEventListener('stop', () => {
      const blob = new Blob(this.__chunks, { type: 'audio/ogg;codecs=opus' });
      saveBlob(blob, `wavenerd-${Date.now()}.ogg`);

      this.__chunks = [];
    });
  }

  public start() {
    this.__recorder.start();
    this.__emit('start');
  }

  public stop() {
    this.__recorder.stop();
    this.__emit('stop');
  }
}
