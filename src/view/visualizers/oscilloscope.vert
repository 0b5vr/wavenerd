#version 300 es

layout (location = 0) in float index;

uniform float scale;
uniform float bufferSize;
uniform float drawIndexRange;
uniform sampler2D samplerL;
uniform float zc;

const float PI = acos(-1.0);
const float TAU = 2.0 * PI;

float sinc(float x) {
  return x == 0.0 ? 1.0 : sin(PI * x) / x / PI;
}

float hann(float x) {
  float xClamped = min(max(x, 0.0), 1.0);
  return 0.5 - 0.5 * cos(TAU * xClamped);
}

void main() {
  vec2 pos = vec2(index / drawIndexRange, 0.0);

  float i0 = index + zc;
  float i0i = floor(i0 + 0.5);

  for (int i = -10; i <= 10; i ++) {
    float texi = i0i + float(i);
    float x = i0 - texi;
    float weight = sinc(x) * hann(x / 20.0 + 0.5);

    float u = (texi + 0.5) / bufferSize;
    float tex = texture(samplerL, vec2(u, 0.5)).x;

    pos.y += tex * weight;
  }

  pos.y *= scale;

  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = 4.0;
}
