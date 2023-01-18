export class Reverb extends GainNode {
  private readonly __audio: AudioContext;
  private readonly __convolver: ConvolverNode;

  public get input(): AudioNode {
    return this.__convolver;
  }

  public constructor( audio: AudioContext ) {
    super( audio );

    this.__audio = audio;

    this.__convolver = audio.createConvolver();
    this.__convolver.buffer = this.__createIR();

    this.__convolver.connect( this );
  }

  /**
   * cringe
   */
  private __createIR(): AudioBuffer {
    const audio = this.__audio;

    const sampleRate = audio.sampleRate;
    const samples = 4.0 * sampleRate;
    const buffer = audio.createBuffer( 2, samples, sampleRate );

    for ( let iCh = 0; iCh < 2; iCh ++ ) {
      const ch = buffer.getChannelData( iCh );

      for ( let i = 0; i < samples; i ++ ) {
        const t = i / sampleRate;
        ch[ i ] = ( Math.random() - 0.5 ) * Math.exp( -5.0 * t );
      }
    }

    return buffer;
  }
}
