import clsx from 'clsx';
import styles from './SettingsMIDIIndicator.module.css';

export function SettingsMIDIIndicator({ messageIndex }: { messageIndex: number }) {
  return (
    <div
      key={messageIndex}
      className={clsx(
        'w-1.25 h-1.25 rounded-[2.5px] bg-modal-bg',
        messageIndex > 0 && styles.indicatorBlink,
      )}
    />
  );
}
