import colorFrag from './color.frag?raw';
import { glCreateBuffer } from './gl/glCreateBuffer';
import { glCreateProgram } from './gl/glCreateProgram';
import { glCreateTexture } from './gl/glCreateTexture';
import vectorscopeVert from './vectorscope.vert?raw';
import { type VisualizerCrispFramebuffer } from './VisualizerCrispFramebuffer';

const DRAW_LENGTH = 4096;
const BUFFER_SIZE = 1024;

export class VisualizerVectorscope {
  public readonly gl: WebGL2RenderingContext;

  public mode: 'none' | 'line' | 'crispline' | 'points';
  public color: [ number, number, number, number ];
  public pointSize: number;
  public pointShape: number;
  public scale: number;
  private readonly __buffer: WebGLBuffer;
  private readonly __program: WebGLProgram;
  private readonly __locations: {
    aspect: WebGLUniformLocation;
    bufferSize: WebGLUniformLocation;
    color: WebGLUniformLocation;
    pointSize: WebGLUniformLocation;
    pointShape: WebGLUniformLocation;
    scale: WebGLUniformLocation;
    samplerL: WebGLUniformLocation;
    samplerR: WebGLUniformLocation;
  };

  private readonly __textureL: WebGLTexture;
  private readonly __textureR: WebGLTexture;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    const array = new Float32Array(DRAW_LENGTH);
    for (let i = 0; i < DRAW_LENGTH; i++) {
      array[i] = i / (DRAW_LENGTH - 1) * (BUFFER_SIZE - 1);
    }
    this.__buffer = glCreateBuffer(gl, array);

    this.__program = glCreateProgram(gl, vectorscopeVert, colorFrag);
    this.__locations = {
      aspect: gl.getUniformLocation(this.__program, 'aspect')!,
      bufferSize: gl.getUniformLocation(this.__program, 'bufferSize')!,
      color: gl.getUniformLocation(this.__program, 'color')!,
      pointSize: gl.getUniformLocation(this.__program, 'pointSize')!,
      pointShape: gl.getUniformLocation(this.__program, 'pointShape')!,
      scale: gl.getUniformLocation(this.__program, 'scale')!,
      samplerL: gl.getUniformLocation(this.__program, 'samplerL')!,
      samplerR: gl.getUniformLocation(this.__program, 'samplerR')!,
    };

    this.__textureL = glCreateTexture(gl);
    this.__textureR = glCreateTexture(gl);

    this.mode = 'none';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.pointSize = 4.0;
    this.pointShape = 0.0;
    this.scale = 1.0;
  }

  public setData(dataL: Float32Array, dataR: Float32Array): void {
    const { gl } = this;

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
      dataL.subarray(-BUFFER_SIZE), // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindTexture(gl.TEXTURE_2D, this.__textureR);
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // level
      gl.R32F, // internalformat
      BUFFER_SIZE, // width
      1, // height
      0, // border
      gl.RED, // format
      gl.FLOAT, // type
      dataR.subarray(-BUFFER_SIZE), // pixels
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public render(crispFramebuffer: VisualizerCrispFramebuffer): void {
    if (this.mode === 'none') { return; }

    const { gl } = this;

    if (this.mode === 'crispline') {
      gl.bindFramebuffer(gl.FRAMEBUFFER, crispFramebuffer.framebuffer);
      crispFramebuffer.usedThisFrame = true;
    }

    gl.useProgram(this.__program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.__buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.uniform1f(this.__locations.aspect, gl.canvas.width / gl.canvas.height);
    gl.uniform1f(this.__locations.bufferSize, BUFFER_SIZE);
    gl.uniform4f(this.__locations.color, ...this.color);
    gl.uniform1f(this.__locations.pointSize, this.pointSize);
    gl.uniform1f(this.__locations.pointShape, this.pointShape);
    gl.uniform1f(this.__locations.scale, this.scale);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureL);
    gl.uniform1i(this.__locations.samplerL, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.__textureR);
    gl.uniform1i(this.__locations.samplerR, 1);

    const primitive = this.mode === 'line' || this.mode === 'crispline' ? gl.LINE_STRIP : gl.POINTS;
    gl.drawArrays(primitive, 0, DRAW_LENGTH);

    if (this.mode === 'crispline') {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }
}
