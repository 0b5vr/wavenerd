import React, { useCallback } from 'react';
import { Fader } from './Fader';
import { Mixer } from '../../Mixer';

// == components ===================================================================================
function XFader( { mixer, className }: {
  mixer: Mixer;
  className?: string;
} ): JSX.Element {
  const handleChange = useCallback(
    ( v ) => {
      mixer.xFaderPos = v;
    },
    [ mixer ]
  );

  return <Fader
    midiParamName="XFader"
    onChange={ handleChange }
    className={ className }
  />;
}

export { XFader };
