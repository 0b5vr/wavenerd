import processorUrl from './LookaheadLimiterProcessor.js?url';

export class LookaheadLimiterNode extends AudioWorkletNode {
  public static addModule(audio: AudioContext): Promise<void> {
    return audio.audioWorklet.addModule(processorUrl);
  }

  public constructor(audio: AudioContext) {
    super(audio, 'lookahead-limiter-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });
  }
}
