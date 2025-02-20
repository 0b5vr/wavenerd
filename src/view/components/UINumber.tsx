import styled from 'styled-components';
import { useMemo } from 'react';
import { useSettings } from '../stores/hooks/useSettings';

// == paths ========================================================================================
const charTable = (
  'e7ff3c3c3cbdbd3c3c3cffe7' // 0
  + 'c1c181818181818181818181' // 1
  + 'f7ff0c0c0ceff7303030ffff' // 2
  + 'f7ff0c0c0ce7ef0c0c0cfff7' // 3
  + '3c3c3c3c3cffef0c0c0c0c0c' // 4
  + 'ffff303030f7ef0c0c0cfff7' // 5
  + 'e7f7303030f7ff3c3c3cffe7' // 6
  + 'ffff0c0c0c0c0c0c0c0c0c0c' // 7
  + 'e7ff3c3c3ce7ff3c3c3cffe7' // 8
  + 'e7ff3c3c3cffef0c0c0cefe7' // 9
  + 'e7ff3c3c3cffff3c3c3c3c3c' // a
  + 'f7ff3c3c3cf7ff3c3c3cfff7' // b
  + 'efff3030303030303030ffef' // c
  + 'f7ff3c3c3c3c3c3c3c3cfff7' // d
  + 'ffff303030f7f7303030ffff' // e
  + 'ffff303030f7f73030303030' // f
  + '000000000000000000003030' // .
  + '000000303000000030300000' // :
);

const widths = '888888888888888822';
//              0123456789abcdef.:

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

  const masks: number[] = useMemo(() => {
    const masks: number[] = [];
    for (let i = 0; i < 24; i++) {
      const c = parseInt(charTable[index * 24 + i], 16);
      masks.push((c >> 0) & 1);
      masks.push((c >> 1) & 1);
      masks.push((c >> 2) & 1);
      masks.push((c >> 3) & 1);
    }
    return masks;
  }, [index]);

  const path = useMemo(() => {
    let path = '';
    for (let i = 0; i < 96; i++) {
      if (masks[i] === 1) {
        const x = i % 8;
        const y = ~~(i / 8);
        path += `M${x} ${y}l0 1l1 0l0-1z`;
      }
    }
    return path;
  }, [masks]);

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
