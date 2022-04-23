import { useRecoilCallback, useRecoilValue } from 'recoil';
import { Colors } from '../constants/Colors';
import { ReactComponent as IconApply } from '../assets/apply.svg';
import { ReactComponent as IconBuild } from '../assets/build.svg';
import { ReactComponent as IconClose } from '../assets/close.svg';
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
          bottom of the editor or press Ctrl+S while you are editing the code.
        </p>
        <p>
          After you compiled the shader, you can cue the shader by
          clicking <IconsInContent as={ IconApply } /> on the bottom of the editor or press Ctrl+R
          while you are editing the code. The cued shader will be applied
          when it reaches the next bar.
        </p>
        <h2>Why is the input time vec4?</h2>
        <p>
          Since the precision of time will be worse in longer live coding performances,
          it gives you four different kind of times.<br />
          Every components represents seconds but these seconds of each components will be looped in
          (a beat, a bar, sixteen bars, infinity).
        </p>
        <h2>How to use params</h2>
        <p>
          TBD<br />
          paramFetch( param_**** )<br />
          or<br />
          sampleNearest( sample_****, sample_****_meta, time )<br />
        </p>
        <h2>How to use samples</h2>
        <p>
          TBD<br />
          sampleSinc( sample_****, sample_****_meta, time )<br />
          or<br />
          sampleNearest( sample_****, sample_****_meta, time )<br />
        </p>
      </Content>
    </Root>
  );
};
