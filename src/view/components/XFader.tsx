import { useSettings } from '../stores/hooks/useSettings';
import { Fader } from './Fader';

// == components ===================================================================================
export function XFader({ className }: { className?: string }) {
  const xfaderMode = useSettings('xfaderMode');

  if (xfaderMode === 'none') {
    return null;
  }

  return (
    <Fader
      midiParamName="/mixer/xfader_pos"
      className={className}
    />
  );
}
