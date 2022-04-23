import React, { useCallback } from 'react';
import { Fader } from './Fader';
import { Mixer } from '../../Mixer';

// == components ===================================================================================
export const XFader: React.FC<{
  mixer: Mixer;
  className?: string;
}> = ( { mixer, className } ) => {
  const handleChange = useCallback(
    ( v: number ) => {
      mixer.xFaderPos = v;
    },
    [ mixer ]
  );

  return <Fader
    midiParamName="XFader"
    onChange={ handleChange }
    className={ className }
  />;
};
