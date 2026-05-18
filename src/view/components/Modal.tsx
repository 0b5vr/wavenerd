import { useCallback } from 'react';
import IconClose from '~icons/mdi/close';

export function Modal({
  onClose,
  children,
}: {
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  const noopStopPropagation = useCallback(
    (event: React.MouseEvent) => event.stopPropagation(),
    [],
  );

  const handleClickClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <div className="fixed w-full h-full flex justify-center items-center bg-black/50" onClick={handleClickClose}>
      <div
        className="relative m-4 p-4 max-w-[calc(100%-32px)] max-h-[calc(100%-32px)] overflow-visible rounded bg-modal-bg text-modal-fg shadow-[0_0_8px_0_var(--color-black)]"
        onClick={noopStopPropagation}
      >
        <IconClose
          className="absolute right-0 -top-8 w-8 h-8 p-0.75 text-fore cursor-pointer rounded-full hover:opacity-80 active:opacity-60"
          onClick={handleClickClose}
          data-stalker="Close"
        />
        {children}
      </div>
    </div>
  );
}
