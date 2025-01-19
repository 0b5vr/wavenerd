export function glCreateProgram(
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string,
): WebGLProgram {
  // -- vertex shader ----------------------------------------------------------------------------
  const shaderVert = gl.createShader(gl.VERTEX_SHADER)!;

  gl.shaderSource(shaderVert, vert);
  gl.compileShader(shaderVert);

  if (!gl.getShaderParameter(shaderVert, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shaderVert) ?? undefined);
  }

  // -- fragment shader --------------------------------------------------------------------------
  const shaderFrag = gl.createShader(gl.FRAGMENT_SHADER)!;

  gl.shaderSource(shaderFrag, frag);
  gl.compileShader(shaderFrag);

  if (!gl.getShaderParameter(shaderFrag, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shaderFrag) ?? undefined);
  }

  // -- program ----------------------------------------------------------------------------------
  const program = gl.createProgram()!;

  gl.attachShader(program, shaderVert);
  gl.attachShader(program, shaderFrag);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? undefined);
  }

  // -- almost done ------------------------------------------------------------------------------
  gl.deleteShader(shaderVert);
  gl.deleteShader(shaderFrag);

  return program;
}
