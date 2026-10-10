# Help

## What is Wavenerd

Wavenerd is an app that lets you write codes to generate sound in GLSL and do live coding performance.

Wavenerd is a web app for now, so you can use it from most modern web browsers without installing anything.

https://0b5vr.github.io/wavenerd/

## How to compile / apply

You can compile shaders at anytime by clicking the Compile button 🔨 on the bottom of the editor.

After you compiled the shader, you can cue the shader by clicking the Apply button ⏩️ on the bottom of the editor.
The cued shader will be applied when it reaches the next bar (= every 4 beats).

## How do I make a sound?

This would be the most simple example:

```glsl
#pragma wavenerd_shader_version 2

vec2 mainAudio(int beatIndex, int beatFrame) {
  float t = float(beatFrame) / sampleRate;
  return 0.1 * vec2(sin(440.0 * 2.0 * 3.1415 * t));
}
```

which just generates the sine wave in 440Hz.

## How do I make a *serious* sound?

Mmmmmm... [Take a look at my codes?](https://github.com/0b5vr/wavenerd-dubplates)

## What are `beatIndex` and `beatFrame`?

`beatIndex` is the number of beats since the beginning, and `beatFrame` is the number of frames (samples) since the beginning of the current beat.
Both are integers, since the precision of float time goes worse in longer live coding performances. Thank you floating point number very cool

You can derive times in seconds like this:

```glsl
float tBeat = float(beatFrame) / sampleRate; // seconds since the beginning of the beat
float tBar = float(beatIndex % 4) * 60.0 / bpm + tBeat; // seconds since the beginning of the bar
float tGlobal = float(beatIndex) * 60.0 / bpm + tBeat; // seconds since the beginning of the track
```

Following uniforms are available:

- `bpm`: The current BPM
- `sampleRate`: The sample rate
- `framesPerBeat`: The max number of frames in a beat

## Why is the audio stuttery sometimes?

Maybe your processor is not catching up with audio generation.
You can change the latency from the setting screen (cog button ⚙️ at the top right corner).

## Keyboard shortcuts

All shortcuts in CodeMirror's [defaultKeymap](https://codemirror.net/docs/ref/#commands.defaultKeymap) are available. In addition, the following Wavenerd-specific shortcuts are available:

- `Ctrl-J`: Focus deck A
- `Ctrl-K`: Focus deck B
- `Ctrl-P`: Open the shader library
- `Ctrl-S`: Compile the code
- `Ctrl-R`: Apply the code
- `Shift-Ctrl-R`: Apply the code immediately
- `Ctrl-,`: Jump to the previous bracket
- `Ctrl-.`: Jump to the next bracket
- `Shift-Ctrl-,`: Extend / shrink selection to the previous sibling bracket
- `Shift-Ctrl-.`: Extend / shrink selection to the next sibling bracket
- `Ctrl-[0-9]`: Load from memory patterns
- `Shift-Ctrl-[0-9]`: Save to memory patterns

## How to use params

Knobs can be used as interactive params.

```glsl
paramFetch(param_knob0)
```

## How to use samples

Samples can be loaded from audio files.
Any audio files which are supported by the [AudioContext.decodeAudioData](https://developer.mozilla.org/ja/docs/Web/API/BaseAudioContext/decodeAudioData) API can be loaded.

```glsl
sampleSinc(sample_****, sample_****_meta, sampleTime)
// or
sampleNearest(sample_****, sample_****_meta, sampleTime)
```

## How to use wavetables

Wavetables can be loaded from raw buffer files.
The raw buffer files must be encoded in float32, 2048 samples per cycle.

```glsl
wavetableSinc(wavetable_****, wavetable_****_meta, vec2(phase, frame))
// or
wavetableNearest(wavetable_****, wavetable_****_meta, vec2(phase, frame))
```

## How to use images

Images can be loaded from... images.

Simply `texture(image_****, uv)` to use.
