export function glCreateBuffer(gl: WebGL2RenderingContext, array: Float32Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buffer;
}
