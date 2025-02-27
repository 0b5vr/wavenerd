#version 300 es

layout (location = 0) in float x;

uniform float scale;
uniform sampler2D samplerL;

void main() {
  vec2 pos = vec2(x, 0.0);

  pos.y += texture(samplerL, vec2(0.5 + 0.5 * x, 0.5)).x;
  pos.y *= scale;

  gl_Position = vec4(pos, 0.0, 1.0);
}
