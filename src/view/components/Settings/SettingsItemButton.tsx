import { ThemeVars } from '../../themes/ThemeVars';
import { SettingsItemBase, type SettingsItemBaseProps } from './SettingsItemBase';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${ThemeVars.modalFg};
  color: ${ThemeVars.modalBg};
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font: 12px 'Inter', sans-serif;
  cursor: pointer;
`;

export function SettingsItemButton(props: {
  label: string;
  onClick: () => void;
} & SettingsItemBaseProps) {
  const { label, onClick } = props;

  return (
    <SettingsItemBase {...props}>
      <StyledButton onClick={onClick}>
        { label }
      </StyledButton>
    </SettingsItemBase>
  );
}
