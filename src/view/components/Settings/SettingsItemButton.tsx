import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';

export function SettingsItemButton(props: {
  label: string;
  onClick: () => void;
} & SettingsItemBaseProps) {
  const { label, onClick } = props;

  return (
    <SettingsItemBase {...props}>
      <button
        className="bg-modal-fg text-modal-bg border-0 rounded py-1 px-2 text-xs font-sans cursor-pointer"
        onClick={onClick}
      >
        { label }
      </button>
    </SettingsItemBase>
  );
}
