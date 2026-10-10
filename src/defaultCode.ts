export const defaultCodeA = `#pragma wavenerd_shader_version 2

#define BPM bpm
#define B2T (60.0 / BPM)

const float PI = acos(-1.0);
const float TAU = 2.0 * PI;

vec2 mainAudio(int beatIndex, int beatFrame) {
  vec2 dest = vec2(0.0);

  float tBeat = float(beatFrame) / sampleRate; // seconds since the beginning of the beat
  float tBar = float(beatIndex % 4) * B2T + tBeat; // seconds since the beginning of the bar

  { // kick
    float t = tBeat;
    float q = B2T - t;

    float env = smoothstep(0.3, 0.1, t) * smoothstep(0.0, 0.01, q);

    float wave = sin(TAU * (
      50.0 * t
      - 8.0 * exp2(-50.0 * t)
    ));

    dest += 0.5 * env * wave;
  }

  { // sawtooth
    float t = tBar;
    float q = B2T - t;

    float env = smoothstep(0.0, 0.01, t) * smoothstep(0.0, 0.01, q);
    env *= exp2(-t);

    float freq = 220.0;
    float phase = freq * t;
    float wave = 2.0 * fract(phase) - 1.0;

    dest += 0.2 * env * wave;
  }

  return dest;
}
`;

export const defaultCodeB = `#pragma wavenerd_shader_version 2

vec2 mainAudio(int beatIndex, int beatFrame) {
  vec2 dest = vec2(0.0);

  return dest;
}
`;
