#version 300 es

precision highp float;

uniform vec4 color;

out vec4 fragColor;

void main() {
  float shape = smoothstep( 0.5, 0.0, length( gl_PointCoord - 0.5 ) );
  fragColor = shape * color;
}
