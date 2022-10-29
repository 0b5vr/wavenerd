import { ANALYSER_TIME_DOMAIN_SIZE, AnalyserResult } from '../../Analyser';
import { LevelMeterResult } from '../../LevelMeter';
import { atom } from 'recoil';

export const analyserInAState = atom<AnalyserResult>( {
  key: 'analyserInAState',
  default: {
    deltaTime: 0.0,
    timeDomainL: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
    timeDomainR: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
  }
} );

export const analyserInBState = atom<AnalyserResult>( {
  key: 'analyserInBState',
  default: {
    deltaTime: 0.0,
    timeDomainL: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
    timeDomainR: new Float32Array( ANALYSER_TIME_DOMAIN_SIZE ),
  }
} );

export const levelMeterInAState = atom<LevelMeterResult>( {
  key: 'levelMeterInAState',
  default: {
    level: 0.0,
    levelL: 0.0,
    levelR: 0.0,
    peak: 0.0,
    peakL: 0.0,
    peakR: 0.0,
  },
} );

export const levelMeterInBState = atom<LevelMeterResult>( {
  key: 'levelMeterInBState',
  default: {
    level: 0.0,
    levelL: 0.0,
    levelR: 0.0,
    peak: 0.0,
    peakL: 0.0,
    peakR: 0.0,
  },
} );

export const levelMeterOutState = atom<LevelMeterResult>( {
  key: 'levelMeterOutState',
  default: {
    level: 0.0,
    levelL: 0.0,
    levelR: 0.0,
    peak: 0.0,
    peakL: 0.0,
    peakR: 0.0,
  },
} );
