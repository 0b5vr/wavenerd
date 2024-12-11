import processorUrl from './DCRemovalProcessor.js?url';

export class DCRemovalNode extends AudioWorkletNode {
  public static addModule(audio: AudioContext): Promise<void> {
    return audio.audioWorklet.addModule(processorUrl);
  }

  constructor(audio: AudioContext) {
    super(audio, 'dc-removal-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });
  }
}
