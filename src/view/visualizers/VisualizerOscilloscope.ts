import { lerp } from '@0b5vr/experimental';
import { ANALYSER_TIME_DOMAIN_SIZE } from '../../audio/Analyser';
import { Visualizer } from './Visualizer';
import colorFrag from './color.frag?raw';
import { glCreateBuffer } from './gl/glCreateBuffer';
import { glCreateProgram } from './gl/glCreateProgram';
import { glCreateTexture } from './gl/glCreateTexture';
import oscilloscopeVert from './oscilloscope.vert?raw';

const DRAW_LENGTH = ANALYSER_TIME_DOMAIN_SIZE;
const DRAW_INDEX_RANGE = 512;

export class VisualizerOscilloscope {
  public readonly visualizer: Visualizer;

  public mode: 'none' | 'line';
  public color: [number, number, number, number];

  private readonly __buffer: WebGLBuffer;
  private readonly __program: WebGLProgram;
  private readonly __locations: {
    aspect: WebGLUniformLocation;
    bufferSize: WebGLUniformLocation;
    drawIndexRange: WebGLUniformLocation;
    color: WebGLUniformLocation;
    samplerL: WebGLUniformLocation;
    zc: WebGLUniformLocation;
  };

  private readonly __textureL: WebGLTexture;

  private __zc: number;

  constructor(visualizer: Visualizer) {
    this.visualizer = visualizer;
    const { gl } = visualizer;

    const array = new Float32Array(DRAW_LENGTH);
    for (let i = 0; i < DRAW_LENGTH; i++) {
      array[i] = lerp(-DRAW_INDEX_RANGE, DRAW_INDEX_RANGE, i / (DRAW_LENGTH - 1));
    }
    this.__buffer = glCreateBuffer(gl, array);

    this.__program = glCreateProgram(gl, oscilloscopeVert, colorFrag);
    this.__locations = {
      aspect: gl.getUniformLocation(this.__program, 'aspect')!,
      bufferSize: gl.getUniformLocation(this.__program, 'bufferSize')!,
      drawIndexRange: gl.getUniformLocation(this.__program, 'drawIndexRange')!,
      color: gl.getUniformLocation(this.__program, 'color')!,
      samplerL: gl.getUniformLocation(this.__program, 'samplerL')!,
      zc: gl.getUniformLocation(this.__program, 'zc')!,
    };

    this.__textureL = glCreateTexture(gl);

    this.__zc = 0;

    this.mode = 'none';
    this.color = [1.0, 1.0, 1.0, 1.0];
  }

  public setData(data: Float32Array, zc: number): void {
    const { gl } = this.visualizer;

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
      data, // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.__zc = zc;
  }

  public render(): void {
    if (this.mode === 'none') { return; }

    const { canvas, gl } = this.visualizer;

    gl.useProgram(this.__program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.uniform1f(this.__locations.aspect, canvas.width / canvas.height);
    gl.uniform1f(this.__locations.bufferSize, ANALYSER_TIME_DOMAIN_SIZE);
    gl.uniform1f(this.__locations.drawIndexRange, DRAW_INDEX_RANGE);
    gl.uniform4f(this.__locations.color, ...this.color);
    gl.uniform1f(this.__locations.zc, this.__zc);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.uniform1i(this.__locations.samplerL, 0);

    const primitive = this.mode === 'line' ? gl.LINE_STRIP : gl.POINTS;
    gl.drawArrays(primitive, 0, DRAW_LENGTH);
  }
}
