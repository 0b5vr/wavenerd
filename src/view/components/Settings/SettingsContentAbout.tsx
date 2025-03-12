import styled from 'styled-components';
import { ThemeVars } from '../../themes/ThemeVars';

const Content = styled.div`
  padding: 0 16px;
  font-size: 12px;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  p {
    margin: 0;
    margin-top: 8px;
  }

  a {
    color: ${ThemeVars.accent};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  code {
    padding: 0px 4px;
    font: 400 12px 'Roboto Mono', sans-serif;
    background-color: ${ThemeVars.inputBack};
    border-radius: 4px;
  }
`;

export function SettingsContentAbout() {
  const hash = COMMIT_HASH.slice(0, 7);
  const date = new Date(COMMIT_DATE).toISOString().slice(0, 10);

  /* eslint-disable @stylistic/jsx-one-expression-per-line */

  return (
    <Content>
      <h1>Wavenerd</h1>
      <p>
        <code>{hash}</code> ({date})
      </p>
      <p>
        Copyright (c) 2020-2025 0b5vr<br />
        Wavenerd is released under the MIT License<br />
        <a href="https://github.com/0b5vr/wavenerd" target="_blank" rel="noreferrer">https://github.com/0b5vr/wavenerd</a>
      </p>
    </Content>
  );

  /* eslint-enable @stylistic/jsx-one-expression-per-line */
}
