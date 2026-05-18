import { useMemo } from 'react';
import { useSettings } from '../stores/hooks/useSettings';
import { arraySerial } from '@0b5vr/experimental';

// == paths ========================================================================================
const charTable = (
  '7effc3c3c3dbdbc3c3c3ff7e' // 0
  + '1c1c18181818181818181818' // 1
  + '7fffc0c0c0fe7f030303ffff' // 2
  + '7fffc0c0c07efec0c0c0ff7f' // 3
  + 'c3c3c3c3c3fffec0c0c0c0c0' // 4
  + 'ffff0303037ffec0c0c0ff7f' // 5
  + '7e7f0303037fffc3c3c3ff7e' // 6
  + 'ffffc0c0c0c0c0c0c0c0c0c0' // 7
  + '7effc3c3c37effc3c3c3ff7e' // 8
  + '7effc3c3c3fffec0c0c0fe7e' // 9
  + '7effc3c3c3ffffc3c3c3c3c3' // a
  + '7fffc3c3c37fffc3c3c3ff7f' // b
  + 'feff0303030303030303fffe' // c
  + '7fffc3c3c3c3c3c3c3c3ff7f' // d
  + 'ffff0303037f7f030303ffff' // e
  + 'ffff0303037f7f0303030303' // f
  + '000000000000000000000303' // .
  + '000000030300000003030000' // :
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

const paths = arraySerial(widths.length).map((i) => {
  let path = '';

  for (let y = 0; y < 12; y++) {
    const ic = i * 24 + y * 2;
    const c = parseInt(charTable.substring(ic, ic + 2), 16);
    for (let x = 0; x < 8; x++) {
      if ((c >> x) & 1) {
        path += `M${x} ${y}l0 1l1 0l0-1z`;
      }
    }
  }

  return path;
});

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
    <div className="flex flex-row justify-center gap-0.5 py-0.5">
      {Array.from(text).map((char, i) => (
        <Char
          key={i}
          char={char}
          color={isActiveArray[i] ? activeColor : inactiveColor}
        />
      ))}
    </div>
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
    <div className="flex flex-row justify-center font-['Roboto_Mono',monospace] text-[14px] leading-4">
      {Array.from(text).map((char, i) => (
        <Char
          key={i}
          char={char}
          color={isActiveArray[i] ? activeColor : inactiveColor}
        />
      ))}
    </div>
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
