#version 300 es

precision highp float;

uniform float pointShape;
uniform vec4 color;

out vec4 fragColor;

void main() {
  float shape = smoothstep(0.5, 0.499 * pointShape, length(gl_PointCoord - 0.5));
  fragColor = shape * vec4(color.rgb, 1.0) * color.a;
}
