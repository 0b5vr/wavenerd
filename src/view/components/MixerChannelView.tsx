import React, { useCallback, useMemo } from 'react';
import { Knob } from './Knob';
import { MixerChannel } from '../../MixerChannel';
import { MixerFader } from './MixerFader';
import styled from 'styled-components';
import { useMidiValue } from '../utils/useMidiValue';

// == styles =======================================================================================
const StyledKnob = styled( Knob )<{ size: number }>`
  width: ${ ( props ) => props.size }px;
  height: ${ ( props ) => props.size }px;
`;

const StyledMixerFader = styled( MixerFader )`
  width: 32px;
  height: calc( 100% - 8px );
`;

const Label = styled.div`
  font: 500 8px 'Roboto', sans-serif;
  line-height: 1;
  opacity: 0.7;
`;

const KnobAndStuff = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const EQsAndFader = styled.div<{ side: 'A' | 'B' }>`
  display: flex;
  gap: 8px;
  flex-direction: ${ ( { side } ) => side === 'A' ? 'row' : 'row-reverse' };
  justify-content: center;
  align-items: center;
`;

const EQs = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Root = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// == functions ====================================================================================
function valueToDisplayDB( value: number ): string {
  if ( value === 0.0 ) {
    return '-INF dB';
  } else {
    const db = 10.0 * Math.log10( 4.0 * value * value );
    return db.toFixed( 2 ) + ' dB';
  }
}

function valueToDisplayEQ( value: number ): string {
  if ( value >= 0.5 ) {
    return `+${ ( ( value - 0.5 ) * 200.0 ).toFixed() }%`;
  } else {
    return `-${ ( ( 0.5 - value ) * 200.0 ).toFixed() }%`;
  }
}

// == microcomponents ==============================================================================
function MixerGainKnob( { label, stalkerText, paramName, onChange }: {
  label: string;
  stalkerText: string;
  paramName: string;
  onChange: ( v: number ) => void;
} ): JSX.Element {
  const value = useMidiValue( paramName );

  const stalkerTextWithValue = useMemo( () => {
    return `${ stalkerText }: ${ valueToDisplayDB( value ) }`;
  }, [ value ] );

  return (
    <KnobAndStuff>
      <StyledKnob
        size={ 32 }
        midiParamName={ paramName }
        resetValue={ 0.5 }
        deltaValuePerPixel={ 1.0 / 256.0 }
        onChange={ onChange }
        stalkerText={ stalkerTextWithValue }
      />
      <Label>{ label }</Label>
    </KnobAndStuff>
  );
}

function MixerEQKnob( { label, stalkerText, paramName, onChange }: {
  label: string;
  stalkerText: string;
  paramName: string;
  onChange: ( v: number ) => void;
} ): JSX.Element {
  const value = useMidiValue( paramName );

  const stalkerTextWithValue = useMemo( () => {
    return `${ stalkerText }: ${ valueToDisplayEQ( value ) }`;
  }, [ value ] );

  return (
    <KnobAndStuff>
      <StyledKnob
        size={ 20 }
        midiParamName={ paramName }
        resetValue={ 0.5 }
        deltaValuePerPixel={ 1.0 / 256.0 }
        onChange={ onChange }
        stalkerText={ stalkerTextWithValue }
      />
      <Label>{ label }</Label>
    </KnobAndStuff>
  );
}

function MixerFaderI( { paramName, stalkerText, onChange }: {
  paramName: string;
  stalkerText: string;
  onChange: ( v: number ) => void;
} ): JSX.Element {
  return (
    <StyledMixerFader
      midiParamName={ paramName }
      onChange={ onChange }
      stalkerText={ stalkerText }
    />
  );
}

// == components ===================================================================================
export const MixerChannelView: React.FC<{
  paramPrefix: string;
  channel: MixerChannel;
  side: 'A' | 'B';
  className?: string;
}> = ( { paramPrefix, channel, side, className } ) => {
  const handleChangeGain = useCallback( ( v: number ) => {
    channel.gain = 4.0 * v * v;
  }, [ channel ] );

  const handleChangeHigh = useCallback( ( v: number ) => {
    channel.eq.high = 4.0 * v * v;
  }, [ channel ] );

  const handleChangeMid = useCallback( ( v: number ) => {
    channel.eq.mid = 4.0 * v * v;
  }, [ channel ] );

  const handleChangeLow = useCallback( ( v: number ) => {
    channel.eq.low = 4.0 * v * v;
  }, [ channel ] );

  const handleChangeVolume = useCallback( ( v: number ) => {
    channel.volume = v * v;
  }, [ channel ] );

  return (
    <Root
      className={ className }
    >
      <MixerGainKnob
        label="GAIN"
        stalkerText="Deck Gain"
        paramName={ paramPrefix + '/gain' }
        onChange={ handleChangeGain }
      />
      <EQsAndFader side={ side }>
        <MixerFaderI
          paramName={ paramPrefix + '/volume' }
          stalkerText="Deck Volume"
          onChange={ handleChangeVolume }
        />
        <EQs>
          <MixerEQKnob
            label="HI"
            stalkerText="Deck EQ High"
            paramName={ paramPrefix + '/high' }
            onChange={ handleChangeHigh }
          />
          <MixerEQKnob
            label="MID"
            stalkerText="Deck EQ Mid"
            paramName={ paramPrefix + '/mid' }
            onChange={ handleChangeMid }
          />
          <MixerEQKnob
            label="LO"
            stalkerText="Deck EQ Low"
            paramName={ paramPrefix + '/low' }
            onChange={ handleChangeLow }
          />
        </EQs>
      </EQsAndFader>
    </Root>
  );
};
