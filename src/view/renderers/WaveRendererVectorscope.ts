import { ANALYSER_TIME_DOMAIN_SIZE } from '../../audio/Analyser';
import { WaveRenderer } from './WaveRenderer';
import colorFrag from './color.frag?raw';
import { glCreateBuffer } from './gl/glCreateBuffer';
import { glCreateProgram } from './gl/glCreateProgram';
import { glCreateTexture } from './gl/glCreateTexture';
import vectorscopeVert from './vectorscope.vert?raw';

const BUFFER_LENGTH = 4.0 * ANALYSER_TIME_DOMAIN_SIZE;

export class WaveRendererVectorscope {
  public readonly renderer: WaveRenderer;

  public mode: 'none' | 'line' | 'points';
  public color: [ number, number, number, number ];

  private readonly __buffer: WebGLBuffer;
  private readonly __program: WebGLProgram;
  private readonly __locations: {
    aspect: WebGLUniformLocation;
    bufferSize: WebGLUniformLocation;
    color: WebGLUniformLocation;
    samplerL: WebGLUniformLocation;
    samplerR: WebGLUniformLocation;
  };

  private readonly __textureL: WebGLTexture;
  private readonly __textureR: WebGLTexture;

  constructor(renderer: WaveRenderer) {
    this.renderer = renderer;
    const { gl } = renderer;

    const array = new Float32Array(BUFFER_LENGTH);
    for (let i = 0; i < BUFFER_LENGTH; i++) {
      array[i] = i / (BUFFER_LENGTH - 1) * (ANALYSER_TIME_DOMAIN_SIZE - 1);
    }
    this.__buffer = glCreateBuffer(gl, array);

    this.__program = glCreateProgram(gl, vectorscopeVert, colorFrag);
    this.__locations = {
      aspect: gl.getUniformLocation(this.__program, 'aspect')!,
      bufferSize: gl.getUniformLocation(this.__program, 'bufferSize')!,
      color: gl.getUniformLocation(this.__program, 'color')!,
      samplerL: gl.getUniformLocation(this.__program, 'samplerL')!,
      samplerR: gl.getUniformLocation(this.__program, 'samplerR')!,
    };

    this.__textureL = glCreateTexture(gl);
    this.__textureR = glCreateTexture(gl);

    this.mode = 'none';
    this.color = [1.0, 1.0, 1.0, 1.0];
  }

  public setData(dataL: Float32Array, dataR: Float32Array): void {
    const { gl } = this.renderer;

    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // level
      gl.R32F, // internalformat
      ANALYSER_TIME_DOMAIN_SIZE, // width
      1, // height
      0, // border
      gl.RED, // format
      gl.FLOAT, // type
      dataL, // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindTexture(gl.TEXTURE_2D, this.__textureR);
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // level
      gl.R32F, // internalformat
      ANALYSER_TIME_DOMAIN_SIZE, // width
      1, // height
      0, // border
      gl.RED, // format
      gl.FLOAT, // type
      dataR, // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public render(): void {
    if (this.mode === 'none') { return; }

    const { canvas, gl } = this.renderer;

    gl.useProgram(this.__program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.uniform1f(this.__locations.aspect, canvas.width / canvas.height);
    gl.uniform1f(this.__locations.bufferSize, ANALYSER_TIME_DOMAIN_SIZE);
    gl.uniform4f(this.__locations.color, ...this.color);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.uniform1i(this.__locations.samplerL, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureR);
    gl.uniform1i(this.__locations.samplerR, 1);

    const primitive = this.mode === 'line' ? gl.LINE_STRIP : gl.POINTS;
    gl.drawArrays(primitive, 0, BUFFER_LENGTH);
  }
}
