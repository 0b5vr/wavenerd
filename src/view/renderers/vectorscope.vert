#version 300 es

layout (location = 0) in float index;

uniform float aspect;
uniform float bufferSize;
uniform sampler2D samplerL;
uniform sampler2D samplerR;

const float PI = acos( -1.0 );
const float TAU = 2.0 * PI;

float sinc( float x ) {
  return x == 0.0 ? 1.0 : sin( PI * x ) / x / PI;
}

float hann( float x ) {
  float xClamped = min( max( x, 0.0 ), 1.0 );
  return 0.5 - 0.5 * cos( TAU * xClamped );
}

void main() {
  vec2 pos = vec2( 0.0 );

  float i0 = floor( index + 0.5 );

  for ( int i = -10; i <= 10; i ++ ) {
    float texi = i0 + float( i );
    float x = index - texi;
    float weight = sinc( x ) * hann( x / 20.0 + 0.5 );

    vec2 tex = vec2(
      texture( samplerL, vec2( ( texi + 0.5 ) / bufferSize, 0.5 ) ).x,
      texture( samplerR, vec2( ( texi + 0.5 ) / bufferSize, 0.5 ) ).x
    );

    pos += tex * weight;
  }

  vec2 correct = aspect < 1.0 ? vec2( 1.0, aspect ) : vec2( 1.0 / aspect, 1.0 );

  gl_Position = vec4( correct * ( pos * mat2( -0.5, 0.5, 0.5, 0.5 ) ), 0.0, 1.0 );
  gl_PointSize = 4.0;
}
