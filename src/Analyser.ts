import { EventEmittable } from './utils/EventEmittable';

export const ANALYSER_TIME_DOMAIN_SIZE = 1024;
export const ANALYSER_FREQUENCY_SIZE = 1024;

export interface AnalyserResult {
  deltaTime: number;
  timeDomainL: Float32Array;
  timeDomainR: Float32Array;
  frequencyL: Float32Array;
  frequencyR: Float32Array;
}

interface AnalyserEvents {
  update: AnalyserResult;
}

export class Analyser extends EventEmittable<AnalyserEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __splitterNode: ChannelSplitterNode;
  private __analyserNodeL: AnalyserNode;
  private __analyserNodeR: AnalyserNode;

  public get input(): AudioNode {
    return this.__splitterNode;
  }

  public timeDomainL: Float32Array;
  public timeDomainR: Float32Array;
  public frequencyL: Float32Array;
  public frequencyR: Float32Array;

  public constructor( audio: AudioContext ) {
    super();

    this.__audio = audio;

    this.__splitterNode = audio.createChannelSplitter( 2 );
    this.__analyserNodeL = audio.createAnalyser();
    this.__analyserNodeR = audio.createAnalyser();

    this.__analyserNodeL.fftSize = 4096;
    this.__analyserNodeR.fftSize = 4096;

    this.__splitterNode.connect( this.__analyserNodeL, 0 );
    this.__splitterNode.connect( this.__analyserNodeR, 1 );

    this.timeDomainL = new Float32Array( ANALYSER_TIME_DOMAIN_SIZE );
    this.timeDomainR = new Float32Array( ANALYSER_TIME_DOMAIN_SIZE );
    this.frequencyL = new Float32Array( ANALYSER_FREQUENCY_SIZE );
    this.frequencyR = new Float32Array( ANALYSER_FREQUENCY_SIZE );
  }

  public update( deltaTime: number ): AnalyserResult {
    this.__analyserNodeL.getFloatTimeDomainData( this.timeDomainL );
    this.__analyserNodeR.getFloatTimeDomainData( this.timeDomainR );
    this.__analyserNodeL.getFloatFrequencyData( this.frequencyL );
    this.__analyserNodeR.getFloatFrequencyData( this.frequencyR );

    const ret = {
      deltaTime: deltaTime,
      timeDomainL: this.timeDomainL,
      timeDomainR: this.timeDomainR,
      frequencyL: this.frequencyL,
      frequencyR: this.frequencyR,
    };

    this.__emit( 'update', ret );

    return ret;
  }
}
