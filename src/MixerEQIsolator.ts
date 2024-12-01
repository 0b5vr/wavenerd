import { MixerEQ } from './MixerEQ';
import { createCrossoverIR } from './createCrossoverIR';

export class MixerEQIsolator extends MixerEQ {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __low = 1.0;
  public get low(): number {
    return this.__low;
  }
  public set low( value: number ) {
    this.__low = value;

    const time = this.__audio.currentTime + 0.005;
    this.__gainNodeLow.gain.linearRampToValueAtTime( this.__low, time );

    this.__emit( 'change', { low: value } );
  }

  private __mid = 1.0;
  public get mid(): number {
    return this.__mid;
  }
  public set mid( value: number ) {
    this.__mid = value;

    const time = this.__audio.currentTime + 0.005;
    this.__gainNodeMid.gain.linearRampToValueAtTime( this.__mid, time );

    this.__emit( 'change', { mid: value } );
  }

  private __high = 1.0;
  public get high(): number {
    return this.__high;
  }
  public set high( value: number ) {
    this.__high = value;

    const time = this.__audio.currentTime + 0.005;
    this.__gainNodeHigh.gain.linearRampToValueAtTime( this.__high, time );

    this.__emit( 'change', { high: value } );
  }

  private __gainNode: GainNode;
  private __convolverNodeLow: ConvolverNode;
  private __convolverNodeMid: ConvolverNode;
  private __convolverNodeHigh: ConvolverNode;
  private __gainNodeLow: GainNode;
  private __gainNodeMid: GainNode;
  private __gainNodeHigh: GainNode;
  private __gainNodeOut: GainNode;

  public get input(): AudioNode {
    return this.__gainNode;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  public constructor( audio: AudioContext ) {
    super();

    this.__audio = audio;

    this.__gainNode = audio.createGain();
    this.__convolverNodeLow = audio.createConvolver();
    this.__convolverNodeMid = audio.createConvolver();
    this.__convolverNodeHigh = audio.createConvolver();
    this.__gainNodeLow = audio.createGain();
    this.__gainNodeMid = audio.createGain();
    this.__gainNodeHigh = audio.createGain();
    this.__gainNodeOut = audio.createGain();

    this.__convolverNodeLow.normalize = false;
    this.__convolverNodeMid.normalize = false;
    this.__convolverNodeHigh.normalize = false;

    this.__convolverNodeLow.buffer = createCrossoverIR( {
      sampleRate: audio.sampleRate,
      lpfFreq: 250.0,
    } );

    this.__convolverNodeMid.buffer = createCrossoverIR( {
      sampleRate: audio.sampleRate,
      hpfFreq: 250.0,
      lpfFreq: 2500.0,
    } );

    this.__convolverNodeHigh.buffer = createCrossoverIR( {
      sampleRate: audio.sampleRate,
      hpfFreq: 2500.0,
    } );

    this.__gainNode.connect( this.__convolverNodeLow );
    this.__gainNode.connect( this.__convolverNodeMid );
    this.__gainNode.connect( this.__convolverNodeHigh );

    this.__convolverNodeLow.connect( this.__gainNodeLow );
    this.__convolverNodeMid.connect( this.__gainNodeMid );
    this.__convolverNodeHigh.connect( this.__gainNodeHigh );

    this.low = 1.0;
    this.mid = 1.0;
    this.high = 1.0;

    this.__gainNodeLow.connect( this.__gainNodeOut );
    this.__gainNodeMid.connect( this.__gainNodeOut );
    this.__gainNodeHigh.connect( this.__gainNodeOut );
  }
}
