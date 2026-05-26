import { EventEmittable } from '../utils/EventEmittable';
import { type RecordingSession } from './RecordingSession';
import { WavRecordingSession } from './WavRecordingSession';
import { NativeMediaRecordingSession } from './NativeMediaRecordingSession';
import { SETTINGSMAN } from '../SettingsManager';

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
    return Object.values(formatConfigs).filter((config) => {
      if (config.format === 'wav') return true; // always available via RecorderNode
      return MediaRecorder.isTypeSupported(config.mimeType);
    });
  }

  public readonly audio: AudioContext;

  public get isRecording(): boolean {
    return this.__session != null;
  }

  public get recordingTime(): number {
    if (this.__recordingStartTime == null) { return 0; }
    return (Date.now() - this.__recordingStartTime) / 1000.0;
  }

  private __inputGain: GainNode;
  private __session: RecordingSession | null = null;
  private __recordingStartTime: number | null = null;

  public get input(): AudioNode {
    return this.__inputGain;
  }

  public constructor(audio: AudioContext) {
    super();

    this.audio = audio;

    this.__inputGain = new GainNode(audio);
  }

  public start() {
    if (this.__session != null) {
      console.error('Recorder is already recording.');
      return;
    }

    const format = SETTINGSMAN.values.recorderFormat;

    if (format === 'wav') {
      this.__session = new WavRecordingSession(this.__inputGain, this.audio);
    } else {
      const config = formatConfigs[format];
      if (config == null) {
        throw new Error(`Unreachable. Unsupported recorder format: ${format}`);
      }
      this.__session = new NativeMediaRecordingSession(this.__inputGain, this.audio, config);
    }

    this.__recordingStartTime = Date.now();
    this.__emit('start');
  }

  public stop() {
    if (this.__session == null) {
      console.error('Recorder is not recording.');
      return;
    }

    this.__session.stop();
    this.__session = null;
    this.__recordingStartTime = null;

    this.__emit('stop');
  }
}
