import blitFrag from './blit.frag?raw';
import blitVert from './blit.vert?raw';
import { glCreateProgram } from './gl/glCreateProgram';
import { glCreateTexture } from './gl/glCreateTexture';

export class VisualizerCrispFramebuffer {
  public readonly gl: WebGL2RenderingContext;

  public readonly framebuffer: WebGLFramebuffer;
  private readonly __texture: WebGLTexture;
  private readonly __programBlit: WebGLProgram;
  private readonly __programBlitLocationSrc: WebGLUniformLocation;
  private __width: number;
  private __height: number;

  public usedThisFrame: boolean;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;

    this.framebuffer = gl.createFramebuffer()!;
    this.__texture = glCreateTexture(gl);
    this.__width = 0;
    this.__height = 0;

    this.usedThisFrame = false;

    this.__programBlit = glCreateProgram(gl, blitVert, blitFrag);
    this.__programBlitLocationSrc = gl.getUniformLocation(this.__programBlit, 'src')!;
  }

  public clear(): void {
    const { gl } = this;

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    if (this.__width !== width || this.__height !== height) {
      gl.bindTexture(gl.TEXTURE_2D, this.__texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindTexture(gl.TEXTURE_2D, null);

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.__texture, 0);

      this.__width = width;
      this.__height = height;
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    }

    if (this.usedThisFrame) {
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      this.usedThisFrame = false;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  public blit(): void {
    const { gl } = this;

    if (this.usedThisFrame) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.useProgram(this.__programBlit);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.__texture);
      gl.uniform1i(this.__programBlitLocationSrc, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
}
