import { ANALYSER_FREQUENCY_SIZE } from '../../audio/constants';
import colorFrag from './color.frag?raw';
import { glCreateBuffer } from './gl/glCreateBuffer';
import { glCreateProgram } from './gl/glCreateProgram';
import { glCreateTexture } from './gl/glCreateTexture';
import spectrumVert from './spectrum.vert?raw';

const BUFFER_LENGTH = ANALYSER_FREQUENCY_SIZE;

export class VisualizerSpectrum {
  public readonly gl: WebGL2RenderingContext;

  public mode: 'none' | 'line';
  public color: [ number, number, number, number ];
  public scale: number;

  private readonly __buffer: WebGLBuffer;
  private readonly __program: WebGLProgram;
  private readonly __locations: {
    bufferSize: WebGLUniformLocation;
    color: WebGLUniformLocation;
    scale: WebGLUniformLocation;
    samplerL: WebGLUniformLocation;
  };

  private readonly __textureL: WebGLTexture;

  public constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    const array = new Float32Array(BUFFER_LENGTH);
    for (let i = 0; i < BUFFER_LENGTH; i++) {
      array[i] = i / (BUFFER_LENGTH - 1);
    }
    this.__buffer = glCreateBuffer(gl, array);

    this.__program = glCreateProgram(gl, spectrumVert, colorFrag);
    this.__locations = {
      bufferSize: gl.getUniformLocation(this.__program, 'bufferSize')!,
      color: gl.getUniformLocation(this.__program, 'color')!,
      scale: gl.getUniformLocation(this.__program, 'scale')!,
      samplerL: gl.getUniformLocation(this.__program, 'samplerL')!,
    };

    this.__textureL = glCreateTexture(gl);

    this.mode = 'none';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.scale = 1.0;
  }

  public setData(dataL: Float32Array): void {
    const { gl } = this;

    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // level
      gl.R32F, // internalformat
      ANALYSER_FREQUENCY_SIZE, // width
      1, // height
      0, // border
      gl.RED, // format
      gl.FLOAT, // type
      dataL, // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public render(): void {
    if (this.mode === 'none') { return; }

    const { gl } = this;

    gl.useProgram(this.__program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.uniform1f(this.__locations.bufferSize, ANALYSER_FREQUENCY_SIZE);
    gl.uniform4f(this.__locations.color, ...this.color);
    gl.uniform1f(this.__locations.scale, this.scale);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.uniform1i(this.__locations.samplerL, 0);

    gl.drawArrays(gl.LINE_STRIP, 0, BUFFER_LENGTH);
  }
}
