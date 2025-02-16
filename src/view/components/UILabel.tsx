import { useMemo } from 'react';
import styled from 'styled-components';
import { ThemeVars } from '../themes/ThemeVars';
import { useSettings } from '../stores/hooks/useSettings';

// == constants ====================================================================================
const charTable = '000001110155000avavau5ekfh842h61m9m110006111634443le4el44v440001100v0000001g8421vhlhv32222vgv1vvgvgvhhvggv1vgvv1vhvvggggvhvhvvhvgv0101001011421240v0v012421vhs0400000vhvhhf9vhvv111vfhhhfv1v1vv1f11v1thvhhvhh11111ggghvh979h1111vvllllvhhhhvhhhvvhv11vhhpvvhv9hv1vgvv4444hhhhvhhha4llllvha4ahhhvgvv842v711171248g744474ah000000v12000vhvhhf9vhvv111vfhhhfv1v1vv1f11v1thvhhvhh11111ggghvh979h1111vvllllvhhhhvhhhvvhv11vhhpvvhv9hv1vgvv4444hhhhvhhha4llllvha4ahhhvgvv842v62326111113262302l80';
//                 SP   !    "    #    $    %    &    '    (    )    *    +    ,    -    .    /    0    1    2    3    4    5    6    7    8    9    :    ;    <    =    >    ?    @    A    B    C    D    E    F    G    H    I    J    K    L    M    N    O    P    Q    R    S    T    U    V    W    X    Y    Z    [    \    ]    ^    _    `    a    b    c    d    e    f    g    h    i    j    k    l    m    n    o    p    q    r    s    t    u    v    w    x    y    z    {    |    }    ~

const charWidthTable = '21355551335515155255555555113535555555555155555555555555555353552555555551555555555555555553135';
//                       !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~

// == styles =======================================================================================
const RootBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: ${ThemeVars.foresub};
`;

const PixelRoot = styled(RootBase)`
  gap: 1px;
  padding: 2px 0 1px;
`;

const TextRoot = styled(RootBase)`
  flex-direction: column;
  text-align: center;
  font-size: 8px;
  line-height: 8px;
`;

// == children =====================================================================================
function PixelLabelChar({ char }: { char: string }) {
  const index = char.charCodeAt(0) - 32;

  const width = parseInt(charWidthTable[index], 10);

  const masks: number[] = useMemo(() => {
    const masks: number[] = [];
    for (let i = 0; i < 5; i++) {
      const c = parseInt(charTable[index * 5 + i], 32);
      masks.push((c >> 0) & 1);
      masks.push((c >> 1) & 1);
      masks.push((c >> 2) & 1);
      masks.push((c >> 3) & 1);
      masks.push((c >> 4) & 1);
    }
    return masks;
  }, [index]);

  return (
    <svg width={width} height="5">
      {masks.map((mask, i) => (mask === 1) && (
        <rect key={i} x={i % 5} y={~~(i / 5)} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}

function PixelLabel({ text, className }: { text: string; className?: string }) {
  return (
    <PixelRoot className={className}>
      {Array.from(text).map((char, i) => (
        <PixelLabelChar key={i} char={char} />
      ))}
    </PixelRoot>
  );
}

function TextLabel({ text, className }: { text: string; className?: string }) {
  return (
    <TextRoot className={className}>
      {text}
    </TextRoot>
  );
}

// == components ===================================================================================
export function UILabel({ text, className }: { text: string; className?: string }) {
  const preferPixelFonts = useSettings('preferPixelFonts');

  if (preferPixelFonts) {
    return <PixelLabel text={text} className={className} />;
  } else {
    return <TextLabel text={text} className={className} />;
  }
}
