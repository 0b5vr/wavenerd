import { lerp } from '@0b5vr/experimental';
import { type Visualizer } from './Visualizer';
import colorFrag from './color.frag?raw';
import { glCreateBuffer } from './gl/glCreateBuffer';
import { glCreateProgram } from './gl/glCreateProgram';
import { glCreateTexture } from './gl/glCreateTexture';
import oscilloscopeVert from './oscilloscope.vert?raw';

const DRAW_LENGTH = 4096;
const BUFFER_SIZE = 8192;

export class VisualizerOscilloscope {
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
    windowWidth: WebGLUniformLocation;
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
      array[i] = lerp(-1.0, 1.0, i / (DRAW_LENGTH - 1));
    }
    this.__buffer = glCreateBuffer(gl, array);

    this.__program = glCreateProgram(gl, oscilloscopeVert, colorFrag);
    this.__locations = {
      scale: gl.getUniformLocation(this.__program, 'scale')!,
      bufferSize: gl.getUniformLocation(this.__program, 'bufferSize')!,
      windowWidth: gl.getUniformLocation(this.__program, 'windowWidth')!,
      color: gl.getUniformLocation(this.__program, 'color')!,
      samplerL: gl.getUniformLocation(this.__program, 'samplerL')!,
      zc: gl.getUniformLocation(this.__program, 'zc')!,
    };

    this.__textureL = glCreateTexture(gl);

    this.__zc = 0;

    this.mode = 'none';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.scale = 0.8;
    this.windowWidth = 2048;
  }

  /**
   * @param data The time domain data. The length must be equal or greater than BUFFER_SIZE.
   */
  public setData(data: Float32Array): void {
    const { gl } = this.visualizer;

    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // level
      gl.R32F, // internalformat
      BUFFER_SIZE, // width
      1, // height
      0, // border
      gl.RED, // format
      gl.FLOAT, // type
      data.subarray(-BUFFER_SIZE), // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * @param timeDomain The low passed time domain data. The length must be equal or greater than BUFFER_SIZE.
   * @param convolverBufferLength The length of the convolver buffer (= 1/2 of the frame delay).
   */
  public calcZeroCrossing(timeDomain: Float32Array, convolverBufferLength: number): void {
    timeDomain = timeDomain.subarray(-BUFFER_SIZE);

    let v0 = 0;

    const i0 = Math.floor(timeDomain.length - this.windowWidth / 2 + convolverBufferLength / 2);
    for (let i = i0; i >= 0; i--) {
      const v1 = timeDomain[i];
      if (v0 > 0 && v1 <= 0) {
        // found a zero crossing point
        this.__zc = i - Math.floor(convolverBufferLength / 2);
        break;
      }
      v0 = v1;
    }
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
    gl.uniform1f(this.__locations.bufferSize, BUFFER_SIZE);
    gl.uniform1f(this.__locations.windowWidth, this.windowWidth);
    gl.uniform4f(this.__locations.color, ...this.color);
    gl.uniform1f(this.__locations.zc, this.__zc);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.uniform1i(this.__locations.samplerL, 0);

    const primitive = this.mode === 'line' ? gl.LINE_STRIP : gl.POINTS;
    gl.drawArrays(primitive, 0, DRAW_LENGTH);
  }
}
