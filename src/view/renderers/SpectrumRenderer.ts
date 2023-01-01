import { ANALYSER_FREQUENCY_SIZE } from '../../Analyser';
import colorFrag from './color.frag?raw';
import spectrumVert from './spectrum.vert?raw';

const BUFFER_LENGTH = ANALYSER_FREQUENCY_SIZE;

export class SpectrumRenderer {
  public mode: 'none' | 'line' | 'points';
  public color: [ number, number, number, number ];

  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;
  private readonly __buffer: WebGLBuffer;
  private readonly __program: WebGLProgram;
  private readonly __locations: {
    aspect: WebGLUniformLocation;
    bufferSize: WebGLUniformLocation;
    color: WebGLUniformLocation;
    samplerL: WebGLUniformLocation;
  };
  private readonly __textureL: WebGLTexture;

  public constructor( canvas: HTMLCanvasElement ) {
    this.canvas = canvas;
    const gl = this.gl = canvas.getContext( 'webgl2' )!;

    gl.enable( gl.BLEND );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
    gl.getExtension( 'EXT_color_buffer_float' );

    this.__buffer = this.__createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, this.__buffer );
    gl.enableVertexAttribArray( 0 );
    gl.vertexAttribPointer( 0, 1, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    this.__program = this.__createProgram();
    this.__locations = {
      aspect: gl.getUniformLocation( this.__program, 'aspect' )!,
      bufferSize: gl.getUniformLocation( this.__program, 'bufferSize' )!,
      color: gl.getUniformLocation( this.__program, 'color' )!,
      samplerL: gl.getUniformLocation( this.__program, 'samplerL' )!,
    };

    this.__textureL = this.__createTexture();

    this.mode = 'none';
    this.color = [ 1.0, 1.0, 1.0, 1.0 ];
  }

  public setData( dataL: Float32Array ): void {
    const { gl } = this;

    gl.bindTexture( gl.TEXTURE_2D, this.__textureL );
    gl.texImage2D(
      gl.TEXTURE_2D, // target
      0, // level
      gl.R32F, // internalformat
      ANALYSER_FREQUENCY_SIZE,
      1,
      0, // border
      gl.RED, // format
      gl.FLOAT, // type
      dataL, // pixels
    );
    gl.bindTexture( gl.TEXTURE_2D, null );
  }

  public render(): void {
    if ( this.mode === 'none' ) { return; }

    const { gl } = this;

    gl.clearColor( 0.0, 0.0, 0.0, 0.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.useProgram( this.__program );

    gl.uniform1f( this.__locations.aspect, this.canvas.width / this.canvas.height );
    gl.uniform1f( this.__locations.bufferSize, ANALYSER_FREQUENCY_SIZE );
    gl.uniform4f( this.__locations.color, ...this.color );

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, this.__textureL );
    gl.uniform1i( this.__locations.samplerL, 0 );

    gl.drawArrays( gl.LINE_STRIP, 0, BUFFER_LENGTH );
  }

  public resize( width: number, height: number ) {
    const { canvas, gl } = this;

    canvas.width = width;
    canvas.height = height;
    gl.viewport( 0, 0, width, height );
  }

  public dispose(): void {
    const { gl } = this;

    gl.getExtension( 'WEBGL_lose_context' )!.loseContext();
  }

  private __createBuffer(): WebGLBuffer {
    const { gl } = this;

    const array = new Float32Array( BUFFER_LENGTH );
    for ( let i = 0; i < BUFFER_LENGTH; i ++ ) {
      array[ i ] = i / ( BUFFER_LENGTH - 1 );
    }

    const buffer = gl.createBuffer()!;

    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, array, gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, null );

    return buffer;
  }

  private __createProgram(): WebGLProgram {
    const { gl } = this;

    // -- vertex shader ----------------------------------------------------------------------------
    const shaderVert = gl.createShader( gl.VERTEX_SHADER )!;

    gl.shaderSource( shaderVert, spectrumVert );
    gl.compileShader( shaderVert );

    if ( !gl.getShaderParameter( shaderVert, gl.COMPILE_STATUS ) ) {
      throw new Error( gl.getShaderInfoLog( shaderVert ) ?? undefined );
    }

    // -- fragment shader --------------------------------------------------------------------------
    const shaderFrag = gl.createShader( gl.FRAGMENT_SHADER )!;

    gl.shaderSource( shaderFrag, colorFrag );
    gl.compileShader( shaderFrag );

    if ( !gl.getShaderParameter( shaderFrag, gl.COMPILE_STATUS ) ) {
      throw new Error( gl.getShaderInfoLog( shaderFrag ) ?? undefined );
    }

    // -- program ----------------------------------------------------------------------------------
    const program = gl.createProgram()!;

    gl.attachShader( program, shaderVert );
    gl.attachShader( program, shaderFrag );

    gl.linkProgram( program );

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
      throw new Error( gl.getProgramInfoLog( program ) ?? undefined );
    }

    // -- almost done ------------------------------------------------------------------------------
    gl.deleteShader( shaderVert );
    gl.deleteShader( shaderFrag );

    return program;
  }

  private __createTexture(): WebGLTexture {
    const { gl } = this;

    const texture = gl.createTexture()!;

    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    gl.bindTexture( gl.TEXTURE_2D, null );

    return texture;
  }
}
