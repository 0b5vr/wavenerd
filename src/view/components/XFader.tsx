import { Fader } from './Fader';
import React from 'react';

// == components ===================================================================================
export const XFader: React.FC<{
  className?: string;
}> = ( { className } ) => {
  return <Fader
    midiParamName="/mixer/xfader_pos"
    className={ className }
  />;
};
