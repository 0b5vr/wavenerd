import { MouseComboBit, mouseCombo } from '../utils/mouseCombo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import { useDoubleTap } from '../utils/useDoubleTap';
import clsx from 'clsx';

// == helpers ======================================================================================
type ValueType = 'int' | 'float';

function inputToValue(value: string, type: ValueType): number | null {
  if (type === 'int') {
    const result = parseInt(value);
    if (Number.isNaN(result)) { return null; }
    return result;
  } else {
    const result = parseFloat(value);
    if (Number.isNaN(result)) { return null; }
    return result;
  }
}

// == element ======================================================================================
export function NumberParam(params: {
  type: ValueType;
  value: number;

  /**
   * Will be called whenever it changes its value.
   * See also: onSettle
   */
  onChange?: (value: number) => void;

  /**
   * Will be called when the user finished tweaking the value.
   * onChange will also be called.
   * See also: onChange
   */
  onSettle?: (value: number, valuePrev: number) => void;

  deltaCoarse?: number;
  deltaFine?: number;

  changeValueWhenInput?: boolean;

  className?: string;

  children?: React.ReactNode;
}) {
  const {
    className,
    type,
    value,
    changeValueWhenInput,
    onChange,
    onSettle,
    children,
  } = params;
  const deltaCoarse = params.deltaCoarse ?? (type === 'int' ? 1.0 : 0.01);
  const deltaFine = params.deltaFine ?? (type === 'int' ? 0.1 : 0.001);

  const [isInput, setIsInput] = useState<boolean>(false);
  const refInput = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputPrevValue, setInputPrevValue] = useState<number>(0.0);
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);
  const checkDoubleClick = useDoubleTap();

  // focus on the input
  useEffect(() => {
    if (isInput) {
      refInput.current!.focus();
    }
  }, [isInput]);

  const trySettle = useCallback(
    (value: number | null, valuePrev: number): void => {
      if (value == null) {
        onChange?.(valuePrev);
        return;
      }

      if (value === valuePrev) {
        return;
      }

      onChange?.(value);
      onSettle?.(value, valuePrev);
    },
    [onChange, onSettle],
  );

  const openInput = useCallback(
    () => {
      setIsInput(true);
      setInputValue(String(value));
      setInputPrevValue(value);
      setIsInputInvalid(false);
    },
    [value],
  );

  const beginDrag = useCallback(
    (event: React.MouseEvent) => {
      if (checkDoubleClick()) {
        openInput();
        return;
      }

      let x = event.clientX - event.clientY;
      const vPrev = value;
      let v = value;
      let hasMoved = false;

      registerMouseEvent(
        (event) => {
          hasMoved = true;

          const x1 = event.clientX - event.clientY;
          const dx = x1 - x;
          x = x1;

          const fine = event.ctrlKey;
          const dv = dx * (fine ? deltaFine : deltaCoarse);
          v += dv;

          if (type === 'int') {
            onChange?.(Math.round(v));
          } else {
            onChange?.(v);
          }
        },
        () => {
          if (!hasMoved) { return; }

          if (type === 'int') {
            trySettle(Math.round(v), vPrev);
          } else {
            trySettle(v, vPrev);
          }
        },
      );
    },
    [checkDoubleClick, value, openInput, deltaFine, deltaCoarse, type, onChange, trySettle],
  );

  const handleClick = useMemo(
    () => mouseCombo({
      [MouseComboBit.LMB]: beginDrag,
      [MouseComboBit.LMB | MouseComboBit.Ctrl]: beginDrag,
    }),
    [beginDrag],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => { // TODO: useCallback
    setInputValue(event.target.value);

    const v = inputToValue(event.target.value, type);
    setIsInputInvalid(v == null);
    if (changeValueWhenInput) {
      if (v != null) {
        onChange?.(v);
      }
    }
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.nativeEvent.key === 'Enter') {
        event.preventDefault();

        const v = inputToValue(inputValue, type);
        trySettle(v, inputPrevValue);

        setIsInput(false);
      } else if (event.nativeEvent.key === 'Escape') {
        event.preventDefault();

        onChange?.(inputPrevValue);

        setIsInput(false);
      }
    },
    [inputValue, type, inputPrevValue, onChange, trySettle],
  );

  const handleBlur = useCallback(
    (): void => {
      const v = inputToValue(inputValue, type);
      trySettle(v, inputPrevValue);

      setIsInput(false);
    },
    [inputValue, type, inputPrevValue, trySettle],
  );

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <div className="cursor-pointer" onMouseDown={handleClick}>
        {children}
      </div>
      {isInput && (
        <input
          ref={refInput}
          className={clsx(
            'absolute block w-full h-full top-0 left-0 font-mono border-0 text-input-fore',
            isInputInvalid ? 'bg-input-back-invalid' : 'bg-input-back',
          )}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}
    </div>
  );
}
