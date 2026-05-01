import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';
import { EventEmittable } from '../utils/EventEmittable';
import { saveBlob } from '../utils/saveBlob';
import { SETTINGSMAN } from '../SettingsManager';

await register(await connect());

interface FormatConfig {
  format: string;
  displayName: string;
  ext: string;
  mimeType: string;
}

const formatConfigs: Record<string, FormatConfig> = {
  'wav': {
    format: 'wav',
    displayName: 'wav',
    ext: 'wav',
    mimeType: 'audio/wav',
  },
  'webm-opus': {
    format: 'webm-opus',
    displayName: 'webm (Opus)',
    ext: 'webm',
    mimeType: 'audio/webm;codecs=opus',
  },
  'ogg-opus': {
    format: 'ogg-opus',
    displayName: 'ogg (Opus)',
    ext: 'ogg',
    mimeType: 'audio/ogg;codecs=opus',
  },
  'm4a-aac': {
    format: 'm4a-aac',
    displayName: 'm4a (AAC)',
    ext: 'm4a',
    mimeType: 'audio/mp4;codecs=aac',
  },
};

interface RecorderEvents {
  start: void;
  stop: void;
}

export class Recorder extends EventEmittable<RecorderEvents> {
  public static getAvailableFormats(): FormatConfig[] {
    return Object.values(formatConfigs)
      .filter((config) => MediaRecorder.isTypeSupported(config.mimeType));
  }

  public readonly audio: AudioContext;

  public get isRecording(): boolean {
    return this.__recorder?.state === 'recording';
  }

  private __streamDest: MediaStreamAudioDestinationNode;
  private __recorder: InstanceType<typeof MediaRecorder> | null;
  private __chunks: Blob[] = [];

  public get input(): AudioNode {
    return this.__streamDest;
  }

  public constructor(audio: AudioContext) {
    super();

    this.audio = audio;

    this.__recorder = null;
    this.__streamDest = new MediaStreamAudioDestinationNode(audio);
  }

  public start() {
    if (this.__recorder != null) {
      console.error('Recorder is already recording.');
      return;
    }

    this.__recorder = this.__createRecorder();
    this.__recorder.start();

    this.__emit('start');
  }

  public stop() {
    if (this.__recorder == null) {
      console.error('Recorder is not recording.');
      return;
    }

    this.__recorder.stop();
    this.__recorder = null;

    this.__emit('stop');
  }

  private __createRecorder(): InstanceType<typeof MediaRecorder> {
    const format = SETTINGSMAN.values.recorderFormat;
    const config = formatConfigs[format];

    if (config == null) {
      throw new Error(`Unreachable. Unsupported recorder format: ${format}`);
    }

    const recorder = new MediaRecorder(this.__streamDest.stream, {
      mimeType: config.mimeType,
      audioBitsPerSecond: 256 * 1024,
    });

    recorder.addEventListener('dataavailable', (event) => {
      this.__chunks.push(event.data);
    });

    recorder.addEventListener('stop', () => {
      const blob = new Blob(this.__chunks, { type: config.mimeType });
      const filename = `wavenerd-${Date.now()}.${config.ext}`;
      saveBlob(blob, filename);

      this.__chunks = [];
    });

    return recorder;
  }
}
