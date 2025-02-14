import { SettingsItemBool } from './SettingsItemBool';
import { SettingsItemRange } from './SettingsItemRange';
import { SettingsItemSelect } from './SettingsItemSelect';
import { SettingsItemText } from './SettingsItemText';
import styled from 'styled-components';

const StyledPercent = styled.span`
  width: 32px;
  font-size: 12px;
  text-align: right;
`;

function suffixFnPercent(value: number) {
  return <StyledPercent>{`${(value * 100).toFixed(0)}%`}</StyledPercent>;
}

export function SettingsContentEditor() {
  return (
    <>
      <SettingsItemText
        settingsKey="editorFont"
        name="Editor Font"
        resettable
        stalkerText="Change the font of the editor.&#10;The syntax is same as the CSS font property."
      />

      <SettingsItemSelect
        settingsKey="editorFontVariantLigatures"
        name="Variant Ligatures"
        stalkerText="Whether to enable font variant ligatures in the editor."
      >
        <option value="none">None</option>
        <option value="normal">Normal</option>
      </SettingsItemSelect>

      <SettingsItemBool
        settingsKey="editorLogEnabled"
        name="Show Editor Log"
        stalkerText="Whether to show the editor log in the bottom right corner."
      />

      <SettingsItemBool
        settingsKey="editorBraceJumpMapEnabled"
        name="Show Brace Jump Map"
        stalkerText="Whether to show the brace jump map when using the brace jump keybindings.&#10;Kinda experimental. Might be removed without notice."
      />

      <SettingsItemRange
        settingsKey="editorBraceJumpMapScale"
        name="Brace Jump Map Scale"
        min={0.5}
        max={1.0}
        step={0.01}
        suffixFn={suffixFnPercent}
        resettable
        stalkerText="The scale of the brace jump map."
      />

      <SettingsItemBool
        settingsKey="editorCompileTimeEnabled"
        name="Show Compile Time"
        stalkerText="Whether to show the compile time in the deck status bar."
      />
    </>
  );
}
