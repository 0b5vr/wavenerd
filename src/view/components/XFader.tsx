import { useSettings } from '../stores/hooks/useSettings';
import { Fader } from './Fader';
import React from 'react';

// == components ===================================================================================
export const XFader: React.FC<{
  className?: string;
}> = ({ className }) => {
  const xfaderMode = useSettings('xfaderMode');

  if (xfaderMode === 'none') {
    return <div className={className} />;
  }

  return (
    <Fader
      midiParamName="/mixer/xfader_pos"
      className={className}
    />
  );
};
