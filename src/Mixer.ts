import { MixerChannel, MixerChannelChangeEvent } from './MixerChannel';
import { Analyser } from './Analyser';
import { DCRemoval } from './DCRemoval';
import { EventEmittable } from './utils/EventEmittable';
import { LevelMeter } from './LevelMeter';
import { SETTINGSMAN } from './SettingsManager';
import { xfaderCurveConstantPower } from './xfaderCurveConstantPower';
import { xfaderCurveCut } from './xfaderCurveCut';
import { xfaderCurveLinear } from './xfaderCurveLinear';
import { xfaderCurveTransition } from './xfaderCurveTransition';

export type XFaderModeType = 'constantPower' | 'cut' | 'linear' | 'transition';

interface MixerChangeEvent {
  xfaderPos?: number;
  channelA?: MixerChannelChangeEvent;
  channelB?: MixerChannelChangeEvent;
}

interface MixerEvents {
  change: MixerChangeEvent;
}

export class Mixer extends EventEmittable<MixerEvents> {
  private __audio: AudioContext;
  public get audio(): AudioContext {
    return this.__audio;
  }

  private __channelA: MixerChannel;
  public get channelA(): MixerChannel {
    return this.__channelA;
  }

  private __channelB: MixerChannel;
  public get channelB(): MixerChannel {
    return this.__channelB;
  }

  private __xFaderPos = 0.5;
  public get xFaderPos(): number {
    return this.__xFaderPos;
  }

  public set xFaderPos(value: number) {
    this.__xFaderPos = value;
    this.__updateXFaderGains();
    this.__emit('change', { xfaderPos: value });
  }

  private __dcRemoval = false;
  public get dcRemoval(): boolean {
    return this.__dcRemoval;
  }

  public set dcRemoval(value: boolean) {
    this.__dcRemoval = value;
    this.__dcRemovalUnit.active = value;
  }

  private __dcRemovalUnit: DCRemoval;

  private __gainXFaderA: GainNode;
  private __gainXFaderB: GainNode;
  private __gainNodeOut: GainNode;

  public get inputA(): AudioNode {
    return this.__channelA.input;
  }

  public get inputB(): AudioNode {
    return this.__channelB.input;
  }

  public get output(): AudioNode {
    return this.__gainNodeOut;
  }

  public readonly analyserInA: Analyser;
  public readonly analyserInB: Analyser;
  public readonly analyserOut: Analyser;

  public readonly levelMeterInA: LevelMeter;
  public readonly levelMeterInB: LevelMeter;
  public readonly levelMeterOut: LevelMeter;

  public constructor(audio: AudioContext) {
    super();

    this.__audio = audio;

    this.__channelA = new MixerChannel(audio);
    this.__channelB = new MixerChannel(audio);
    this.__gainXFaderA = audio.createGain();
    this.__gainXFaderB = audio.createGain();
    this.__gainNodeOut = audio.createGain();

    this.__dcRemovalUnit = new DCRemoval(audio);

    this.__channelA.output.connect(this.__gainXFaderA);
    this.__channelB.output.connect(this.__gainXFaderB);
    this.__gainXFaderA.connect(this.__dcRemovalUnit.input);
    this.__gainXFaderB.connect(this.__dcRemovalUnit.input);
    this.__dcRemovalUnit.output.connect(this.__gainNodeOut);

    this.analyserInA = new Analyser(audio);
    this.analyserInB = new Analyser(audio);
    this.analyserOut = new Analyser(audio);

    this.__channelA.outputForAnal.connect(this.analyserInA.input);
    this.__channelB.outputForAnal.connect(this.analyserInB.input);
    this.__gainNodeOut.connect(this.analyserOut.input);

    this.levelMeterInA = new LevelMeter(this.analyserInA);
    this.levelMeterInB = new LevelMeter(this.analyserInB);
    this.levelMeterOut = new LevelMeter(this.analyserOut);

    SETTINGSMAN.on('change', ({ xfaderMode }) => {
      if (xfaderMode != null) {
        this.__updateXFaderGains();
      }
    });

    this.__channelA.on('change', (event) => this.__emit('change', { channelA: event }));
    this.__channelB.on('change', (event) => this.__emit('change', { channelB: event }));
  }

  public updateAnalyser(deltaTime: number): void {
    this.analyserInA.update(deltaTime);
    this.analyserInB.update(deltaTime);
    this.analyserOut.update(deltaTime);
  }

  private __updateXFaderGains(): void {
    const [a, b] = this.__getXFaderValue();

    const time = this.__audio.currentTime + 0.005;

    this.__gainXFaderA.gain.linearRampToValueAtTime(a, time);
    this.__gainXFaderB.gain.linearRampToValueAtTime(b, time);
  }

  private __getXFaderValue(): [ number, number ] {
    const x = this.__xFaderPos;
    const mode = SETTINGSMAN.values.xfaderMode;

    if (mode === 'constantPower') {
      return xfaderCurveConstantPower(x);
    } else if (mode === 'cut') {
      return xfaderCurveCut(x);
    } else if (mode === 'linear') {
      return xfaderCurveLinear(x);
    } else {
      return xfaderCurveTransition(x);
    }
  }
}
