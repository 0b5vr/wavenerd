import { LINEAR_RAMP_TIME } from './constants';

const HALF_PI = Math.PI * 0.5;

export class CueMixer {
  private readonly __audio: AudioContext;

  private __gainA: number;
  public get gainA(): number {
    return this.__gainA;
  }

  public set gainA(value: number) {
    this.__gainA = value;
    this.__updateGains();
  }

  private __gainB: number;
  public get gainB(): number {
    return this.__gainB;
  }

  public set gainB(value: number) {
    this.__gainB = value;
    this.__updateGains();
  }

  private __masterMix: number;
  public get masterMix(): number {
    return this.__masterMix;
  }

  public set masterMix(value: number) {
    this.__masterMix = value;
    this.__updateGains();
  }

  private __inputA: GainNode;
  public get inputA(): AudioNode {
    return this.__inputA;
  }

  private __inputB: GainNode;
  public get inputB(): AudioNode {
    return this.__inputB;
  }

  private __inputMaster: GainNode;
  public get inputMaster(): AudioNode {
    return this.__inputMaster;
  }

  private __gainOut: GainNode;
  public get output(): AudioNode {
    return this.__gainOut;
  }

  public constructor(audio: AudioContext) {
    this.__audio = audio;

    this.__gainA = 0.0;
    this.__gainB = 0.0;
    this.__masterMix = 0.0;

    this.__inputA = audio.createGain();
    this.__inputB = audio.createGain();
    this.__inputMaster = audio.createGain();
    this.__gainOut = audio.createGain();

    this.__inputA.connect(this.__gainOut);
    this.__inputB.connect(this.__gainOut);
    this.__inputMaster.connect(this.__gainOut);

    this.__updateGains();
  }

  private __updateGains(): void {
    const time = this.__audio.currentTime + LINEAR_RAMP_TIME;
    const masterMix = Math.sin(HALF_PI * this.__masterMix);
    const cueMix = Math.cos(HALF_PI * this.__masterMix);

    this.__inputA.gain.linearRampToValueAtTime(this.__gainA * cueMix, time);
    this.__inputB.gain.linearRampToValueAtTime(this.__gainB * cueMix, time);
    this.__inputMaster.gain.linearRampToValueAtTime(masterMix, time);
  }
}
