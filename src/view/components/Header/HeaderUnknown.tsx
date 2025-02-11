import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';

const Root = styled.div`
  font: 14px 'Roboto Mono', monospace;
  color: ${ThemeVars.error};
`;

export function HeaderUnknown({ name }: { name: string }) {
  return (
    <Root
      data-stalker={`Unknown header item: ${name}. Check the settings to make sure it's a valid item.`}
    >
      {name}
    </Root>
  );
}
