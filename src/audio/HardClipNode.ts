import processorUrl from './HardClipProcessor.js?url';

export class HardClipNode extends AudioWorkletNode {
  public static addModule(audio: AudioContext): Promise<void> {
    return audio.audioWorklet.addModule(processorUrl);
  }

  public constructor(audio: AudioContext) {
    super(audio, 'hard-clip-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });
  }
}
