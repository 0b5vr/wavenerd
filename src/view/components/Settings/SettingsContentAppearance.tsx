import { themes } from '../../themes/themes';
import { SettingsItemBool } from './SettingsItemBool';
import { SettingsItemButtonFullscreen } from './SettingsItemButtonFullscreen';
import { SettingsItemSelect } from './SettingsItemSelect';
import { SettingsItemText } from './SettingsItemText';

export function SettingsContentAppearance() {
  return (
    <>
      <SettingsItemButtonFullscreen />

      <SettingsItemSelect
        settingsKey="theme"
        name="Theme"
        stalkerText="Change the appearance theme."
      >
        { Object.entries(themes).map(([key, { displayName }]) => (
          <option key={key} value={key}>{ displayName }</option>
        )) }
      </SettingsItemSelect>

      <SettingsItemText
        settingsKey="headerItems"
        name="Header Items"
        resettable
        stalkerText="Change the items to show in the header.&#10;Available items: logo, transport, time, beat-number, beat-hex, beat-dots, bpm, nudge.&#10;I will implement a proper UI for this later 😅"
      />

      <SettingsItemText
        settingsKey="headerIcons"
        name="Header Icons"
        resettable
        stalkerText="Change the icons to show in the header.&#10;Available icons: recorder, midi, settings, help, github, deck-b, fullscreen.&#10;If settings is not in the list, it will automatically add a transparent settings icon.&#10;I will implement a proper UI for this later 😅"
      />

      <SettingsItemBool
        settingsKey="deckBShow"
        name="Show Deck B"
        stalkerText="Whether to show the deck B."
      />
    </>
  );
}
