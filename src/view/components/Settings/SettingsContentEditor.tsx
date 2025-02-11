import { SettingsItemBool } from './SettingsItemBool';
import { SettingsItemSelect } from './SettingsItemSelect';
import { SettingsItemText } from './SettingsItemText';

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
    </>
  );
}
