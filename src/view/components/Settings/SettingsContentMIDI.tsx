import { SettingsItemMIDIDeviceList } from './SettingsItemMIDIDeviceList';
import { SettingsItemMIDIMappings } from './SettingsItemMIDIMappings';
import { SettingsItemMIDIMonitor } from './SettingsItemMIDIMonitor';

// == components ===================================================================================
export function SettingsContentMIDI() {
  return (
    <>
      <SettingsItemMIDIDeviceList />
      <SettingsItemMIDIMappings />
      <SettingsItemMIDIMonitor />
    </>
  );
}
