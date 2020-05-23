export const defaultCode = `#define BPM bpm

#define PI 3.14159265359
#define TAU 6.28318530718

float kick( float t ) {
  if ( t < 0.0 ) { return 0.0; }

  float attack = 4.0;

  return exp( -4.0 * t ) * sin( TAU * (
    50.0 * t - attack * ( exp( -40.0 * t ) + exp( -200.0 * t ) )
  ) );
}

vec2 mainAudio( vec4 time ) {
  vec2 dest = vec2( 0.0 );

  float tKick = time.x; // time.x = a beat
  float aKick = kick( tKick );
  dest += 0.3 * aKick;

  return dest;
}
`;
