import { midiLearningAtom } from '../atoms/midi';
import { useAtomValue } from 'jotai';

export function useMidiLearning(paramName: string): boolean {
  const learning = useAtomValue(midiLearningAtom);
  return learning === paramName;
}
