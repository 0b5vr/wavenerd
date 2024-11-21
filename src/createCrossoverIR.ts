const PI = Math.PI;
const TAU = 2.0 * PI;
const LENGTH = 255;
const BANDS = 8192;
const CENTER = ( LENGTH + 1 ) / 2 - 1;

const WINDOW = [ ...Array( CENTER ) ].map( ( _, i ) => (
  // cosine window
  0.5 + 0.5 * Math.cos( PI * i / CENTER )
) );

export function createCrossoverIR( options: {
  sampleRate: number,
  lpfFreq?: number,
  hpfFreq?: number,
} ): AudioBuffer {
  const { sampleRate, lpfFreq, hpfFreq } = options;

  const buffer = new AudioBuffer( { length: LENGTH, numberOfChannels: 1, sampleRate } );
  const dest = buffer.getChannelData( 0 );

  const ws = [ ...Array( BANDS ) ].map( ( _, i ) => PI * i / ( BANDS - 1 ) );
  const wLPF = lpfFreq && TAU * lpfFreq / sampleRate;
  const wHPF = hpfFreq && TAU * hpfFreq / sampleRate;
  const gs = ws.map( ( w ) => {
    let g = 1.0 / BANDS;
    g *= wLPF ? 1.0 / ( 1.0 + Math.pow( w / wLPF, 4 ) ) : 1.0;
    g *= wHPF ? 1.0 / ( 1.0 + Math.pow( wHPF / w, 4 ) ) : 1.0;
    return g;
  } );

  for ( let i = 0; i < BANDS; i ++ ) {
    const w = ws[ i ];
    const g = gs[ i ];

    // https://scrapbox.io/0b5vr/Sine_with_recurrence_formula
    let s2 = Math.cos( w );
    let s1 = 1.0;
    const c = 2.0 * Math.cos( w );

    dest[ CENTER ] += g;

    for ( let j = 1; j < CENTER; j ++ ) {
      const s = c * s1 - s2;
      s2 = s1;
      s1 = s;

      const a = g * s * WINDOW[ j ];

      dest[ CENTER + j ] += a;
      dest[ CENTER - j ] += a;
    }
  }

  return buffer;
}
