import styled from 'styled-components';
import { useMemo } from 'react';
import { useSettings } from '../stores/hooks/useSettings';

// == paths ========================================================================================
const paths = [
  'M 1 0 L 1 1 L 0 1 L 0 11 L 1 11 L 1 12 L 7 12 L 7 11 L 8 11 L 8 1 L 7 1 L 7 0 Z M 2 2 L 6 2 L 6 10 L 2 10 Z M 3 5 L 3 7 L 5 7 L 5 5 Z', // 0
  'M 2 0 L 2 2 L 3 2 L 3 12 L 5 12 L 5 0 Z', // 1
  'M 0 0 L 0 2 L 6 2 L 6 5 L 1 5 L 1 6 L 0 6 L 0 12 L 8 12 L 8 10 L 2 10 L 2 7 L 7 7 L 7 6 L 8 6 L 8 1 L 7 1 L 7 0 Z', // 2
  'M 0 0 L 0 2 L 6 2 L 6 5 L 1 5 L 1 7 L 6 7 L 6 10 L 0 10 L 0 12 L 7 12 L 7 11 L 8 11 L 8 6 L 7 6 L 7 5 L 8 5 L 8 1 L 7 1 L 7 0 Z', // 3
  'M 0 0 L 0 6 L 1 6 L 1 7 L 6 7 L 6 12 L 8 12 L 8 0 L 6 0 L 6 5 L 2 5 L 2 0 Z', // 4
  'M 0 0 L 0 6 L 1 6 L 1 7 L 6 7 L 6 10 L 0 10 L 0 12 L 7 12 L 7 11 L 8 11 L 8 6 L 7 6 L 7 5 L 2 5 L 2 2 L 8 2 L 8 0 Z', // 5
  'M 1 0 L 1 1 L 0 1 L 0 11 L 1 11 L 1 12 L 7 12 L 7 11 L 8 11 L 8 6 L 7 6 L 7 5 L 2 5 L 2 2 L 8 2 L 8 0 Z M 2 7 L 6 7 L 6 10 L 2 10 Z', // 6
  'M 0 0 L 0 2 L 6 2 L 6 12 L 8 12 L 8 0 Z', // 7
  'M 1 0 L 1 1 L 0 1 L 0 5 L 1 5 L 1 6 L 0 6 L 0 11 L 1 11 L 1 12 L 7 12 L 7 11 L 8 11 L 8 6 L 7 6 L 7 5 L 8 5 L 8 1 L 7 1 L 7 0 Z M 2 2 L 6 2 L 6 5 L 2 5 Z M 2 7 L 6 7 L 6 10 L 2 10 Z', // 8
  'M 1 0 L 1 1 L 0 1 L 0 6 L 1 6 L 1 7 L 6 7 L 6 10 L 1 10 L 1 12 L 7 12 L 7 11 L 8 11 L 8 1 L 7 1 L 7 0 Z M 2 2 L 6 2 L 6 5 L 2 5 Z', // 9
  'M 1 0 L 1 1 L 0 1 L 0 12 L 2 12 L 2 7 L 6 7 L 6 12 L 8 12 L 8 1 L 7 1 L 7 0 Z M 2 2 L 6 2 L 6 5 L 2 5 Z', // a
  'M 0 0 L 0 12 L 7 12 L 7 11 L 8 11 L 8 6 L 7 6 L 7 5 L 8 5 L 8 1 L 7 1 L 7 0 Z M 2 2 L 6 2 L 6 5 L 2 5 Z M 2 7 L 6 7 L 6 10 L 2 10 Z', // b
  'M 1 0 L 1 1 L 0 1 L 0 11 L 1 11 L 1 12 L 8 12 L 8 10 L 2 10 L 2 2 L 8 2 L 8 0 Z', // c
  'M 0 0 L 0 12 L 7 12 L 7 11 L 8 11 L 8 1 L 7 1 L 7 0 Z M 2 2 L 6 2 L 6 10 L 2 10 Z', // d
  'M 0 0 L 0 12 L 8 12 L 8 10 L 2 10 L 2 7 L 7 7 L 7 5 L 2 5 L 2 2 L 8 2 L 8 0 Z', // e
  'M 0 0 L 0 12 L 2 12 L 2 7 L 7 7 L 7 5 L 2 5 L 2 2 L 8 2 L 8 0 Z', // f
  'M 0 10 L 0 12 L 2 12 L 2 10 Z', // .
  'M 0 3 L 0 5 L 2 5 L 2 3 Z M 0 8 L 0 10 L 2 10 L 2 8 Z', // :
];

const widths = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2, 2];

const charIndexMap = new Map<string, number>([
  ['0', 0],
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
  ['a', 10],
  ['b', 11],
  ['c', 12],
  ['d', 13],
  ['e', 14],
  ['f', 15],
  ['.', 16],
  [':', 17],
]);

// == functions ====================================================================================
function calcIsActiveArray(text: string, forceActiveFrom?: number): boolean[] {
  let isActive = false;
  const ret: boolean[] = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (isActive) {
      // do nothing
    } else if (i === text.length - 1) {
      isActive = true;
    } else if ((forceActiveFrom ?? 65535) <= i) {
      isActive = true;
    } else if (char === '0' || char === '.' || char === ':') {
      // do nothing
    } else {
      isActive = true;
    }
    ret.push(isActive);
  }
  return ret;
}

// == styles =======================================================================================
const RootBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const PixelRoot = styled(RootBase)`
  gap: 2px;
  padding: 2px 0 2px;
`;

const TextRoot = styled(RootBase)`
  font: 14px/16px "Roboto Mono", monospace;
`;

// == children =====================================================================================
function PixelChar({
  char,
  color,
}: {
  char: string;
  color: string;
}) {
  const index = charIndexMap.get(char)!;
  const width = widths[index];
  const path = paths[index];

  return (
    <svg width={width} height="12">
      <path d={path} fill={color} />
    </svg>
  );
}

function TextChar({
  char,
  color,
}: {
  char: string;
  color: string;
}) {
  return <div style={{ color }}>{char}</div>;
}

function Char({
  char,
  color,
}: {
  char: string;
  color: string;
}) {
  const preferPixelFonts = useSettings('preferPixelFonts');

  if (preferPixelFonts) {
    return <PixelChar char={char} color={color} />;
  } else {
    return <TextChar char={char} color={color} />;
  }
}

function PixelNumber({
  text,
  activeColor,
  inactiveColor,
  forceActiveFrom,
}: {
  text: string;
  activeColor: string;
  inactiveColor: string;
  forceActiveFrom?: number;
}) {
  const isActiveArray = useMemo(
    () => calcIsActiveArray(text, forceActiveFrom),
    [text, forceActiveFrom],
  );

  return (
    <PixelRoot>
      {Array.from(text).map((char, i) => (
        <Char
          key={i}
          char={char}
          color={isActiveArray[i] ? activeColor : inactiveColor}
        />
      ))}
    </PixelRoot>
  );
}

function TextNumber({
  text,
  activeColor,
  inactiveColor,
  forceActiveFrom,
}: {
  text: string;
  activeColor: string;
  inactiveColor: string;
  forceActiveFrom?: number;
}) {
  const isActiveArray = useMemo(
    () => calcIsActiveArray(text, forceActiveFrom),
    [text, forceActiveFrom],
  );

  return (
    <TextRoot>
      {Array.from(text).map((char, i) => (
        <Char
          key={i}
          char={char}
          color={isActiveArray[i] ? activeColor : inactiveColor}
        />
      ))}
    </TextRoot>
  );
}

// == components ===================================================================================
export function UINumber({
  text,
  activeColor,
  inactiveColor,
  forceActiveFrom,
}: {
  text: string;
  activeColor: string;
  inactiveColor: string;
  forceActiveFrom?: number;
}) {
  const preferPixelFonts = useSettings('preferPixelFonts');

  if (preferPixelFonts) {
    return (
      <PixelNumber
        text={text}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        forceActiveFrom={forceActiveFrom}
      />
    );
  } else {
    return (
      <TextNumber
        text={text}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        forceActiveFrom={forceActiveFrom}
      />
    );
  }
}
