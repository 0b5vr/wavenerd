import { lerp } from '@0b5vr/experimental';
import { type Visualizer } from './Visualizer';
import colorFrag from './color.frag?raw';
import { glCreateBuffer } from './gl/glCreateBuffer';
import { glCreateProgram } from './gl/glCreateProgram';
import { glCreateTexture } from './gl/glCreateTexture';
import waveformVert from './waveform.vert?raw';
import { ANALYSER_TIME_DOMAIN_SIZE } from '../../audio/constants';

const DRAW_LENGTH = 4096;

export class VisualizerWaveform {
  public readonly visualizer: Visualizer;

  public mode: 'none' | 'line';
  public color: [number, number, number, number];
  public scale: number;
  public windowWidth: number;
  private readonly __buffer: WebGLBuffer;
  private readonly __program: WebGLProgram;
  private readonly __locations: {
    scale: WebGLUniformLocation;
    bufferSize: WebGLUniformLocation;
    color: WebGLUniformLocation;
    samplerL: WebGLUniformLocation;
  };

  private readonly __textureL: WebGLTexture;

  constructor(visualizer: Visualizer) {
    this.visualizer = visualizer;
    const { gl } = visualizer;

    const array = new Float32Array(DRAW_LENGTH);
    for (let i = 0; i < DRAW_LENGTH; i++) {
      array[i] = lerp(-1.0, 1.0, i / (DRAW_LENGTH - 1));
    }
    this.__buffer = glCreateBuffer(gl, array);

    this.__program = glCreateProgram(gl, waveformVert, colorFrag);
    this.__locations = {
      scale: gl.getUniformLocation(this.__program, 'scale')!,
      bufferSize: gl.getUniformLocation(this.__program, 'bufferSize')!,
      color: gl.getUniformLocation(this.__program, 'color')!,
      samplerL: gl.getUniformLocation(this.__program, 'samplerL')!,
    };

    this.__textureL = glCreateTexture(gl);

    this.mode = 'none';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.scale = 0.8;
    this.windowWidth = ANALYSER_TIME_DOMAIN_SIZE;
  }

  public setData(data: Float32Array): void {
    const { gl } = this.visualizer;

    const dataDownsampled = new Float32Array(DRAW_LENGTH);
    for (let i = 0; i < DRAW_LENGTH; i++) {
      const j = data.length - this.windowWidth + Math.floor(i * this.windowWidth / DRAW_LENGTH);
      dataDownsampled[i] = data[j];
    }

    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // level
      gl.R32F, // internalformat
      DRAW_LENGTH, // width
      1, // height
      0, // border
      gl.RED, // format
      gl.FLOAT, // type
      dataDownsampled, // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public render(): void {
    if (this.mode === 'none') { return; }

    const { gl } = this.visualizer;

    gl.useProgram(this.__program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.uniform1f(this.__locations.scale, this.scale);
    gl.uniform1f(this.__locations.bufferSize, ANALYSER_TIME_DOMAIN_SIZE);
    gl.uniform4fv(this.__locations.color, this.color);
    gl.uniform1i(this.__locations.samplerL, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.uniform1i(this.__locations.samplerL, 0);

    const primitive = this.mode === 'line' ? gl.LINE_STRIP : gl.POINTS;
    gl.drawArrays(primitive, 0, DRAW_LENGTH);
  }
}
