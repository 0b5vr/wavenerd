export const defaultCodeA = `#define BPM bpm
#define B2T (60.0 / BPM)

const float PI = acos(-1.0);
const float TAU = 2.0 * PI;

vec2 mainAudio(vec4 time) {
  vec2 dest = vec2(0.0);

  { // kick
    float t = time.x; // time.x = a beat
    float q = B2T - time.x;

    float env = smoothstep(0.3, 0.1, t) * smoothstep(0.0, 0.01, q);

    float wave = sin(TAU * (
      50.0 * t
      - 8.0 * exp2(-50.0 * t)
    ));

    dest += 0.5 * env * wave;
  }

  return dest;
}
`;

export const defaultCodeB = `vec2 mainAudio(vec4 time) {
  return dest;
}
`;
