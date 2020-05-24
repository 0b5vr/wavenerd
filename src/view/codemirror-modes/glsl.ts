// yoinked from https://github.com/hughsk/glsl-editor/blob/master/glsl.js
// The original source is distributed under MIT license: https://github.com/hughsk/glsl-editor/blob/master/LICENSE.md

/* eslint-disable no-prototype-builtins */

import CodeMirror from 'codemirror';

class Context {
  public indented: number;
  public column: number;
  public type: string;
  public align: boolean | null;
  public prev?: Context;

  public constructor(
    indented: number,
    column: number,
    type: string,
    align: boolean | null,
    prev?: Context
  ) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.align = align;
    this.prev = prev;
  }
}

interface State {
  tokenize: Tokenizer | null;
  context: Context;
  indented: number;
  startOfLine: boolean;
}

type Tokenizer = ( stream: CodeMirror.StringStream, state: State ) => string;

function words( words: string[] ): { [ word: string ]: true } {
  return words.reduce( ( accum, current ) => {
    accum[ current ] = true;
    return accum;
  }, {} as { [ word: string ]: true } );
}

const glslKeywords = words( [
  'attribute', 'const', 'uniform', 'varying', 'break', 'continue', 'do', 'for', 'while', 'if',
  'else', 'in', 'out', 'inout', 'float', 'int', 'void', 'bool', 'true', 'false', 'lowp', 'mediump',
  'highp', 'precision', 'invariant', 'discard', 'return', 'mat2', 'mat3', 'mat4', 'vec2', 'vec3',
  'vec4', 'ivec2', 'ivec3', 'ivec4', 'bvec2', 'bvec3', 'bvec4', 'sampler2D', 'samplerCube',
  'struct', 'gl_FragCoord', 'gl_FragColor'
] );

const glslBuiltins = words( [
  'radians', 'degrees', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'pow', 'exp', 'log', 'exp2',
  'log2', 'sqrt', 'inversesqrt', 'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max',
  'clamp', 'mix', 'step', 'smoothstep', 'length', 'distance', 'dot', 'cross', 'normalize',
  'faceforward', 'reflect', 'refract', 'matrixCompMult', 'lessThan', 'lessThanEqual', 'greaterThan',
  'greaterThanEqual', 'equal', 'notEqual', 'any', 'all', 'not', 'dFdx', 'dFdy', 'fwidth',
  'texture2D', 'texture2DProj', 'texture2DLod', 'texture2DProjLod', 'textureCube', 'textureCubeLod',
  'require', 'export'
] );

const glslBlockKeywords = words( [
  'case', 'do', 'else', 'for', 'if', 'switch', 'while', 'struct'
] );

const glslAtoms = words( [
  'null'
] );

export function defineGLSLMode(): void {
  CodeMirror.defineMode( 'glsl', ( config, parserConfig ) => {
    const indentUnit = config.indentUnit ?? 0;
    const keywords = parserConfig.keywords || glslKeywords;
    const builtins = parserConfig.builtins || glslBuiltins;
    const blockKeywords = parserConfig.blockKeywords || glslBlockKeywords;
    const atoms = parserConfig.atoms || glslAtoms;
    const hooks = parserConfig.hooks || {};
    const isOperatorChar = /[+\-*&%=<>!?|/]/;
    const multiLineStrings = parserConfig.multiLineStrings;

    let curPunc;

    function tokenBase( stream: CodeMirror.StringStream, state: State ) {
      const ch = stream.next();

      if ( ch == null ) {
        return null;
      }

      if ( hooks[ ch ] ) {
        const result = hooks[ ch ]( stream, state );
        if ( result !== false ) { return result; }
      }

      if ( ch === '"' || ch === '\'' ) {
        state.tokenize = tokenString( ch );
        return state.tokenize( stream, state );
      }

      if ( /[[\]{}(),;:.]/.test( ch ) ) {
        curPunc = ch;
        return 'bracket';
      }

      if ( /\d/.test( ch ) ) {
        stream.eatWhile( /[\w.]/ );
        return 'number';
      }

      if ( ch === '/' ) {
        if ( stream.eat( '*' ) ) {
          state.tokenize = tokenComment;
          return tokenComment( stream, state );
        }
        if ( stream.eat( '/' ) ) {
          stream.skipToEnd();
          return 'comment';
        }
      }

      if ( ch === '#' ) {
        stream.eatWhile( /[\S]+/ );
        stream.eatWhile( /[\s]+/ );
        stream.eatWhile( /[\S]+/ );
        stream.eatWhile( /[\s]+/ );
        return 'keyword';
      }

      if ( isOperatorChar.test( ch ) ) {
        stream.eatWhile( isOperatorChar );
        return 'operator';
      }

      stream.eatWhile( /[\w$_]/ );
      const cur = stream.current();
      if ( keywords.propertyIsEnumerable( cur ) ) {
        if ( blockKeywords.propertyIsEnumerable( cur ) ) { curPunc = 'newstatement'; }
        return 'keyword';
      }
      if ( builtins.propertyIsEnumerable( cur ) ) {
        return 'builtin';
      }
      if ( atoms.propertyIsEnumerable( cur ) ) { return 'atom'; }
      return 'word';
    }

    function tokenString( quote: '"' | '\'' ): Tokenizer {
      return function( stream, state ) {
        let escaped = false, next, end = false;
        while ( ( next = stream.next() ) != null ) {
          if ( next === quote && !escaped ) { end = true; break; }
          escaped = !escaped && next === '\\';
        }
        if ( end || !( escaped || multiLineStrings ) )
        { state.tokenize = tokenBase; }
        return 'string';
      };
    }

    const tokenComment: Tokenizer = function( stream, state ) {
      let maybeEnd = false;
      let ch = stream.next();
      while ( ch != null ) {
        if ( ch === '/' && maybeEnd ) {
          state.tokenize = tokenBase;
          break;
        }
        maybeEnd = ( ch === '*' );
        ch = stream.next();
      }
      return 'comment';
    };

    function pushContext( state: State, col: number, type: string ) {
      return state.context = new Context( state.indented, col, type, null, state.context );
    }
    function popContext( state: State ) {
      const t = state.context.type;
      if ( t === ')' || t === ']' || t === '}' ) {
        state.indented = state.context.indented;
      }
      state.context = state.context.prev!;
      return state.context;
    }

    // Interface

    return {
      startState: function(): State {
        return {
          tokenize: null,
          context: new Context( 0 - indentUnit, 0, 'top', false ),
          indented: 0,
          startOfLine: true
        };
      },

      token: function( stream: CodeMirror.StringStream, state: State ) {
        let ctx = state.context;
        if ( stream.sol() ) {
          if ( ctx.align == null ) { ctx.align = false; }
          state.indented = stream.indentation();
          state.startOfLine = true;
        }
        if ( stream.eatSpace() ) { return null; }
        curPunc = null;
        const style = ( state.tokenize || tokenBase )( stream, state );
        if ( style === 'comment' || style === 'meta' ) { return style; }
        if ( ctx.align === null ) { ctx.align = true; }

        if ( ( curPunc === ';' || curPunc === ':' ) && ctx.type === 'statement' ) {
          popContext( state );
        } else if ( curPunc === '{' ) {
          pushContext( state, stream.column(), '}' );
        } else if ( curPunc === '[' ) {
          pushContext( state, stream.column(), ']' );
        } else if ( curPunc === '(' ) {
          pushContext( state, stream.column(), ')' );
        } else if ( curPunc === '}' ) {
          while ( ctx.type === 'statement' ) { ctx = popContext( state ); }
          if ( ctx.type === '}' ) { ctx = popContext( state ); }
          while ( ctx.type === 'statement' ) { ctx = popContext( state ); }
        } else if ( curPunc === ctx.type ) {
          popContext( state );
        } else if (
          ctx.type === '}' ||
          ctx.type === 'top' ||
          ( ctx.type === 'statement' && curPunc === 'newstatement' )
        ) {
          pushContext( state, stream.column(), 'statement' );
        }

        state.startOfLine = false;
        return style;
      },

      indent: function( state, textAfter ) {
        if ( state.tokenize !== tokenBase && state.tokenize != null ) { return 0; }
        const firstChar = textAfter && textAfter.charAt( 0 );
        const ctx = state.context;
        const closing = firstChar === ctx.type;
        if ( ctx.type === 'statement' ) {
          return ctx.indented + ( firstChar === '{' ? 0 : indentUnit );
        } else if ( ctx.align ) {
          return ctx.column + ( closing ? 0 : 1 );
        } else {
          return ctx.indented + ( closing ? 0 : indentUnit );
        }
      },

      electricChars: '{}'
    };
  } );
}

function cppHook( stream: CodeMirror.StringStream, state: any ) {
  if ( !state.startOfLine ) { return false; }
  stream.skipToEnd();
  return 'meta';
}

export function defineGLSLMime(): void {
  CodeMirror.defineMIME( 'text/x-glsl', {
    name: 'glsl',
    keywords: glslKeywords,
    builtins: glslBuiltins,
    blockKeywords: glslBlockKeywords,
    atoms: glslAtoms,
    hooks: { '#': cppHook }
  } );
}
