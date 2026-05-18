import { type PrimitiveAtom, useAtomValue } from 'jotai';
import { useSettings } from '../stores/hooks/useSettings';
import styles from './DeckLog.module.css';

interface Props {
  logsAtom: PrimitiveAtom<[ id: number, text: string ][]>;
}

function DeckLogInside({ logsAtom }: Props) {
  const logs = useAtomValue(logsAtom);
  const font = useSettings('editorFont');

  return (
    <div className="absolute right-0 bottom-6 flex flex-col-reverse items-end gap-1 p-1">
      {logs.map(([id, text]) => (
        <div
          key={id}
          className={`text-xs px-1 rounded bg-overlay-back text-fore ${styles.logEntry}`}
          style={{
            font,
            fontVariantLigatures: 'none',
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}

export function DeckLog({ logsAtom }: Props) {
  const logEnabled = useSettings('editorLogEnabled');

  if (!logEnabled) {
    return null;
  }

  return <DeckLogInside logsAtom={logsAtom} />;
}
