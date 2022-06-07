/* eslint-disable max-len */
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
import IconApply from '~icons/mdi/reload';
import IconBuild from '~icons/mdi/hammer';
import IconClose from '~icons/mdi/close';
import React from 'react';
import { helpIsOpeningState } from '../states/help';
import styled from 'styled-components';

// == styles =======================================================================================
const IconsInContent = styled.svg`
  position: relative;
  top: 0.125em;
  width: 1em;
  height: 1em;
  transform: scale(1.25);
  fill: ${ Colors.fore };
`;

const Content = styled.div`
  max-width: 640px;
  max-height: 100%;
  margin: 0 auto;
  padding: 0 16px;
  overflow: auto;
`;

const Close = styled( IconClose )`
  position: absolute;
  right: 16px;
  top: 16px;
  width: 24px;
  height: 24px;
  fill: ${ Colors.fore };
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const Root = styled.div`
  padding: 16px;
  border-radius: 4px;
  background: ${ Colors.back2 };
  box-shadow: 0 0 8px 0 ${ Colors.black };

  h2 {
    margin: 32px 0 16px;
  }

  p {
    margin: 16px 0;
  }

  a {
    color: ${ Colors.accent };
    text-decoration: none;
  }

  code {
    padding: 0px 4px;
    background-color: ${ Colors.back1 };
    color: ${ Colors.foresub };
    border-radius: 4px;
  }
`;

// == components ===================================================================================
export const Help: React.FC<{
  className?: string;
}> = ( { className } ) => {
  const isOpening = useRecoilValue( helpIsOpeningState );

  const handleClickClose = useRecoilCallback(
    ( { set } ) => () => {
      set( helpIsOpeningState, false );
    },
    []
  );

  if ( !isOpening ) {
    return null;
  }

  return (
    <Root
      className={ className }
    >
      <Close
        onClick={ handleClickClose }
      />
      <Content>
        <h1>Help</h1>
        <h2>What is Wavenerd</h2>
        <p>
          Wavenerd is an app that lets you write codes to generate sound in GLSL
          and do live coding performance.<br />
        </p>
        <h2>How to compile / apply</h2>
        <p>
          You can compile shaders at anytime by clicking <IconsInContent as={ IconBuild } /> on the
          bottom of the editor.
        </p>
        <p>
          After you compiled the shader, you can cue the shader by
          clicking <IconsInContent as={ IconApply } /> on the bottom of the editor.<br />
          The cued shader will be applied when it reaches the next bar.
        </p>
        <h2>How do I make the sound?</h2>
        <p>
          This would be the most simple example:
        </p>
        <p>
          <code>
            vec2 mainAudio( vec4 time ) &#123;<br />
            &nbsp;&nbsp;return vec2( sin( 440.0 * 2.0 * 3.1415 * time.x ) );<br />
            &#125;
          </code>
        </p>
        <p>
          which just generates the sine wave in 440Hz.
        </p>
        <h2>Why is the input time vec4?</h2>
        <p>
          It gives you four different kind of times.<br />
          Every components represent times in the unit of second but each loops in
          (a beat, a bar, sixteen bars, infinity).<br />
          It&apos;s since the precision of time goes worse in longer live coding performances.
          Thank you floating point number very cool
        </p>
        <h2>How to use params</h2>
        <p>
          Knobs can be used as interactive params.<br />
        </p>
        <p>
          <code>sampleSinc( sample_****, sample_****_meta, time )</code><br />
        </p>
        <h2>How to use samples</h2>
        <p>
          Samples can be loaded from audio files.<br />
          Any audio files which are supported by the <a href="https://developer.mozilla.org/ja/docs/Web/API/BaseAudioContext/decodeAudioData" target="_blank" rel="noreferrer">AudioContext.decodeAudioData</a> API
          can be loaded.<br />
        </p>
        <p>
          <code>sampleSinc( sample_****, sample_****_meta, time )</code><br />
          or<br />
          <code>sampleNearest( sample_****, sample_****_meta, time )</code><br />
        </p>
        <h2>How to use wavetables</h2>
        <p>
          Wavetables can be loaded from raw buffer files.<br />
          The raw buffer files must be encoded in float32, 2048 samples per cycle.<br />
        </p>
        <p>
          <code>wavetableSinc( wavetable_****, wavetable_****_meta, vec2( phase, frame ) )</code><br />
          or<br />
          <code>wavetableNearest( wavetable_****, wavetable_****_meta, vec2( phase, frame ) )</code><br />
        </p>
        <h2>How to use images</h2>
        <p>
          Images can be loaded from... images.<br />
        </p>
        <p>
          Simply <code>texture( image_****, uv )</code> to use.<br />
        </p>
      </Content>
    </Root>
  );
};
