#version 300 es

layout (location = 0) in float x;

uniform float aspect;
uniform float bufferSize;
uniform sampler2D samplerL;

const float PI = acos( -1.0 );
const float TAU = 2.0 * PI;

float linearstep( float a, float b, float t ) {
  float xClamped = min( max( x, 0.0 ), 1.0 );
  return ( t - a ) / ( b - a );
}

float sinc( float x ) {
  return x == 0.0 ? 1.0 : sin( PI * x ) / x / PI;
}

float hann( float x ) {
  float xClamped = min( max( x, 0.0 ), 1.0 );
  return 0.5 - 0.5 * cos( TAU * xClamped );
}

void main() {
  float value = 0.0;

  float logt = mix( log2( 2.0 ), log2( bufferSize ), x );
  float t = exp2( logt );
  float t0 = floor( t + 0.5 );

  for ( int i = -10; i <= 10; i ++ ) {
    float texi = t0 + float( i );
    float x = t - texi;
    float weight = sinc( x ) * hann( x / 20.0 + 0.5 );

    float tex = texture( samplerL, vec2( ( texi + 0.5 ) / bufferSize, 0.5 ) ).x;

    value += tex * weight;
  }

  value = 0.5 * linearstep( -100.0, 0.0, value );

  vec2 correct = vec2( 1.0, aspect );

  gl_Position = vec4( correct * vec2( 2.0 * x - 1.0, value ) - vec2( 0.0, 1.0 ), 0.0, 1.0 );
  gl_PointSize = 4.0;
}
