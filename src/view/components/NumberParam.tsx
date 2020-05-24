import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Colors } from '../constants/Colors';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';
import { useDoubleTap } from '../utils/useDoubleTap';

// == helpers ======================================================================================
type ValueType = 'int' | 'float';

function inputToValue( value: string, type: ValueType ): number | null {
  if ( type === 'int' ) {
    const result = parseInt( value );
    if ( Number.isNaN( result ) ) { return null; }
    return result;
  } else {
    const result = parseFloat( value );
    if ( Number.isNaN( result ) ) { return null; }
    return result;
  }
}

function valueToInput( value: number, type: ValueType, digits: number ): string {
  if ( type === 'int' ) {
    return Math.floor( value ).toString();
  } else {
    return ( value ).toFixed( digits );
  }
}

// == styles =======================================================================================
const Input = styled.input< { isInvalid: boolean } >`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  font-family: monospace;
  padding: 0.1rem;
  border: none;
  background: ${ ( { isInvalid } ) => ( isInvalid ? Colors.errorBright : Colors.foresub ) };
  color: ${ Colors.back1 };
`;

const Value = styled.div`
  cursor: pointer;
`;

const Root = styled.div`
  position: relative;
  overflow: hidden;
`;

// == element ======================================================================================
const NumberParam = ( params: {
  type: ValueType;
  value: number;

  /**
   * Will be called whenever it changes its value.
   * See also: onSettle
   */
  onChange?: ( value: number ) => void;

  /**
   * Will be called when the user finished tweaking the value.
   * onChange will also be called.
   * See also: onChange
   */
  onSettle?: ( value: number, valuePrev: number ) => void;

  deltaCoarse?: number;
  deltaFine?: number;
  fixedDigits?: number;

  changeValueWhenInput?: boolean;

  className?: string;
} ): JSX.Element => {
  const {
    className,
    type,
    value,
    changeValueWhenInput,
    onChange,
    onSettle
  } = params;
  const fixedDigits = params.fixedDigits ?? 3;
  const deltaCoarse = params.deltaCoarse ?? ( type === 'int' ? 1.0 : 0.01 );
  const deltaFine = params.deltaFine ?? ( type === 'int' ? 0.1 : 0.001 );

  const [ isInput, setIsInput ] = useState<boolean>( false );
  const refInput = useRef<HTMLInputElement>( null );
  const [ inputValue, setInputValue ] = useState<string>( '' );
  const [ inputPrevValue, setInputPrevValue ] = useState<number>( 0.0 );
  const [ isInputInvalid, setIsInputInvalid ] = useState<boolean>( false );
  const checkDoubleClick = useDoubleTap();

  useEffect( () => { // focus on the input
    if ( isInput ) {
      refInput.current!.focus();
    }
  }, [ isInput ] );

  const trySettle = useCallback(
    ( value: number | null, valuePrev: number ): void => {
      if ( value == null ) {
        onChange && onChange( valuePrev );
        return;
      }

      if ( value === valuePrev ) {
        return;
      }

      onChange && onChange( value );
      onSettle && onSettle( value, valuePrev );
    },
    [ onChange, onSettle ]
  );

  const openInput = useCallback(
    () => {
      setIsInput( true );
      setInputValue( String( value ) );
      setInputPrevValue( value );
      setIsInputInvalid( false );
    },
    [ value ]
  );

  const grabValue = useCallback(
    () => {
      const vPrev = value;
      let v = vPrev;
      let hasMoved = false;

      registerMouseEvent(
        ( event, movementSum ) => {
          hasMoved = true;

          const fine = event.altKey;
          const delta = fine ? deltaFine : deltaCoarse;
          v += delta * -movementSum.y;

          if ( type === 'int' ) {
            onChange && onChange( Math.round( v ) );
          } else {
            onChange && onChange( v );
          }
        },
        () => {
          if ( !hasMoved ) { return; }

          trySettle( v, vPrev );
        }
      );
    },
    [ value, type, onChange, trySettle ]
  );

  const handleClick = useCallback(
    mouseCombo( {
      [ MouseComboBit.LMB ]: () => {
        if ( checkDoubleClick() ) {
          openInput();
        } else {
          grabValue();
        }
      }
      // TODO: LMB + Shift to reset the value. probably adding `resetValue` to props
    } ),
    [ openInput, grabValue ]
  );

  const handleChange = ( event: React.ChangeEvent<HTMLInputElement> ): void => { // TODO: useCallback
    setInputValue( event.target.value );

    const v = inputToValue( event.target.value, type );
    setIsInputInvalid( v == null );
    if ( changeValueWhenInput ) {
      if ( v != null ) {
        onChange && onChange( v );
      }
    }
  };

  const handleKeyDown = useCallback(
    ( event: React.KeyboardEvent<HTMLInputElement> ): void => {
      if ( event.nativeEvent.key === 'Enter' ) {
        event.preventDefault();

        const v = inputToValue( inputValue, type );
        trySettle( v, inputPrevValue );

        setIsInput( false );
      } else if ( event.nativeEvent.key === 'Escape' ) {
        event.preventDefault();

        onChange && onChange( inputPrevValue );

        setIsInput( false );
      }
    },
    [ inputValue, type, inputPrevValue, onChange, trySettle ]
  );

  const handleBlur = useCallback(
    (): void => {
      const v = inputToValue( inputValue, type );
      trySettle( v, inputPrevValue );

      setIsInput( false );
    },
    [ inputValue, type, inputPrevValue, trySettle ]
  );

  const displayValue = valueToInput( value, type, fixedDigits );

  return (
    <Root className={ className }>
      <Value
        onMouseDown={ handleClick }
      >{ displayValue }</Value>
      {
        isInput && (
          <Input
            ref={ refInput }
            value={ inputValue }
            onChange={ handleChange }
            onKeyDown={ handleKeyDown }
            onBlur={ handleBlur }
            isInvalid={ isInputInvalid }
          />
        )
      }
    </Root>
  );
};

export { NumberParam };
