import React, { useCallback, useMemo } from 'react';
import IconCue from '~icons/mdi/headphones';
import { Knob } from './Knob';
import { MIDIMAN } from '../../MIDIManager';
import { MixerFader } from './MixerFader';
import { ThemeVars } from '../themes/ThemeVars';
import { openContextMenuAtom } from '../stores/atoms/contextMenu';
import styled from 'styled-components';
import { useAtomCallback } from 'jotai/utils';
import { useMidiLearning } from '../stores/hooks/useMidiLearning';
import { useMidiValue } from '../stores/hooks/useMidiValue';
import { useSettings } from '../stores/hooks/useSettings';

// == styles =======================================================================================
const StyledKnob = styled( Knob )<{ size: number }>`
  width: ${ ( props ) => props.size }px;
  height: ${ ( props ) => props.size }px;
`;

const StyledMixerFader = styled( MixerFader )`
  width: 32px;
  height: 96px;
`;

const KnobLabel = styled.div`
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

const CueButtonRoot = styled.div<{ active: boolean, islearning: boolean | undefined }>`
  width: 20px;
  height: 20px;
  margin: 2px;
  color: ${ ( { active } ) => active ? ThemeVars.accent : ThemeVars.gray };

  box-shadow: ${ ( { islearning } ) => (
    islearning
      ? `0 0 0 2px ${ ThemeVars.accent }`
      : 'none'
  ) };
`;

const Row = styled.div<{ side: 'A' | 'B' }>`
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
function MixerGainKnob( { label, stalkerText, paramName }: {
  label: string;
  stalkerText: string;
  paramName: string;
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
        stalkerText={ stalkerTextWithValue }
      />
      <KnobLabel>{ label }</KnobLabel>
    </KnobAndStuff>
  );
}

function MixerEQKnob( { label, stalkerText, paramName }: {
  label: string;
  stalkerText: string;
  paramName: string;
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
        stalkerText={ stalkerTextWithValue }
      />
      <KnobLabel>{ label }</KnobLabel>
    </KnobAndStuff>
  );
}

function MixerFaderI( { paramName, stalkerText }: {
  paramName: string;
  stalkerText: string;
} ): JSX.Element {
  return (
    <StyledMixerFader
      midiParamName={ paramName }
      stalkerText={ stalkerText }
    />
  );
}

function CueButton( { paramName, stalkerText }: {
  paramName: string;
  stalkerText: string;
} ): JSX.Element {
  const value = useMidiValue( paramName );
  const isLearning = useMidiLearning( paramName );

  const handleClick = useCallback( () => {
    const currentValue = MIDIMAN.values[ paramName ];
    MIDIMAN.setValue( paramName, currentValue > 0.0 ? 0.0 : 1.0 );
  }, [] );

  const handleContextMenu = useAtomCallback( useCallback(
    ( _, set, event: React.MouseEvent ) => {
      event.preventDefault();

      set( openContextMenuAtom, {
        position: [ event.clientX, event.clientY ],
        commands: [
          {
            name: 'Learn MIDI',
            callback: () => {
              MIDIMAN.learn( paramName );
            }
          }
        ]
      } );
    },
    [ paramName ],
  ) );

  return (
    <CueButtonRoot
      active={ value > 0.0 }
      islearning={ isLearning }
      onClick={ handleClick }
      onContextMenu={ handleContextMenu }
      data-stalker={ stalkerText }
    >
      <IconCue />
    </CueButtonRoot>
  );
}

// == components ===================================================================================
export const MixerChannelView: React.FC<{
  paramPrefix: string;
  cueParamName: string;
  side: 'A' | 'B';
  className?: string;
}> = ( { paramPrefix, cueParamName, side, className } ) => {
  const eqMode = useSettings( 'eqMode' );

  return (
    <Root
      className={ className }
    >
      <Row side={ side }>
        <MixerGainKnob
          label="GAIN"
          stalkerText="Deck Gain"
          paramName={ paramPrefix + '/gain' }
        />
        <CueButton
          paramName={ cueParamName }
          stalkerText="Deck Cue"
        />
      </Row>
      <Row side={ side }>
        { eqMode !== 'none' && <EQs>
          <MixerEQKnob
            label="HI"
            stalkerText="Deck EQ High"
            paramName={ paramPrefix + '/eq/high' }
          />
          <MixerEQKnob
            label="MID"
            stalkerText="Deck EQ Mid"
            paramName={ paramPrefix + '/eq/mid' }
          />
          <MixerEQKnob
            label="LO"
            stalkerText="Deck EQ Low"
            paramName={ paramPrefix + '/eq/low' }
          />
        </EQs> }
        <MixerFaderI
          paramName={ paramPrefix + '/volume' }
          stalkerText="Deck Volume"
        />
      </Row>
    </Root>
  );
};
