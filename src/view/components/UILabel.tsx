import clsx from 'clsx';
import { memo } from 'react';
import { useSettings } from '../stores/hooks/useSettings';
import { arraySerial } from '@0b5vr/experimental';

// == constants ====================================================================================
const charTable = '000001110155000avavau5ekfh842h61m9m110006111634443le4el44v440001100v0000001g8421vhlhv32222vgv1vvgvgvhhvggv1vgvv1vhvvggggvhvhvvhvgv0101001011421240v0v012421vhs0400000vhvhhf9vhvv111vfhhhfv1v1vv1f11v1thvhhvhh11111ggghvh979h1111vvllllvhhhhvhhhvvhv11vhhpvvhv9hv1vgvv4444hhhhvhhha4llllvha4ahhhvgvv842v711171248g744474ah000000v12000vhvhhf9vhvv111vfhhhfv1v1vv1f11v1thvhhvhh11111ggghvh979h1111vvllllvhhhhvhhhvvhv11vhhpvvhv9hv1vgvv4444hhhhvhhha4llllvha4ahhhvgvv842v62326111113262302l80';
//                 SP   !    "    #    $    %    &    '    (    )    *    +    ,    -    .    /    0    1    2    3    4    5    6    7    8    9    :    ;    <    =    >    ?    @    A    B    C    D    E    F    G    H    I    J    K    L    M    N    O    P    Q    R    S    T    U    V    W    X    Y    Z    [    \    ]    ^    _    `    a    b    c    d    e    f    g    h    i    j    k    l    m    n    o    p    q    r    s    t    u    v    w    x    y    z    {    |    }    ~

const charWidthTable = '21355551335515155255555555113535555555555155555555555555555353552555555551555555555555555553135';
//                       !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~

const paths = arraySerial(charWidthTable.length).map((i) => {
  let path = '';

  for (let y = 0; y < 5; y++) {
    const c = parseInt(charTable[i * 5 + y], 32);
    for (let x = 0; x < 5; x++) {
      if ((c >> x) & 1) {
        path += `M${x} ${y}l0 1l1 0l0-1z`;
      }
    }
  }

  return path;
});

// == styles =======================================================================================
const baseCls = 'flex justify-center text-foresub';

// == children =====================================================================================
const PixelLabelChar = memo(function PixelLabelChar({ char }: { char: string }) {
  const index = char.charCodeAt(0) - 32;
  const width = parseInt(charWidthTable[index], 10);
  const path = paths[index];

  return (
    <svg width={width} height="5">
      <path d={path} fill="currentColor" />
    </svg>
  );
});

const PixelLabel = memo(function PixelLabel({ text, className }: { text: string; className?: string }) {
  return (
    <div className={clsx(baseCls, 'flex-row gap-px pt-0.5 pb-px', className)}>
      {Array.from(text).map((char, i) => (
        <PixelLabelChar key={i} char={char} />
      ))}
    </div>
  );
});

const TextLabel = memo(function TextLabel({ text, className }: { text: string; className?: string }) {
  return (
    <div className={clsx(baseCls, 'flex-col text-center text-[8px] leading-2', className)}>
      {text}
    </div>
  );
});

// == components ===================================================================================
export const UILabel = memo(function UILabel({ text, className }: { text: string; className?: string }) {
  const preferPixelFonts = useSettings('preferPixelFonts');

  if (preferPixelFonts) {
    return <PixelLabel text={text} className={className} />;
  } else {
    return <TextLabel text={text} className={className} />;
  }
});
