import { useCallback, useContext, useRef, useState } from 'react';
import { StuffContext } from '../../StuffContext';
import { SettingsItemButton } from './SettingsItemButton';
import { exportStorageArchive, importStorageArchive } from '../../../storageArchive';
import { saveBlob } from '../../../utils/saveBlob';

/**
 * Format the given date e.g. 20241107-145500
 * @param date A date to format
 * @returns The formatted date string
 */
function formatDate(date: Date): string {
  const pad = (v: number) => v.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export function SettingsContentData() {
  const { storageManager } = useContext(StuffContext)!;
  const refInput = useRef<HTMLInputElement>(null);
  const [isBusy, setBusy] = useState(false);

  const handleExport = useCallback(async () => {
    if (isBusy) { return; }
    setBusy(true);

    try {
      const blob = await exportStorageArchive(storageManager);
      saveBlob(blob, `wavenerd-${formatDate(new Date())}.zip`);
    } catch (error) {
      console.error(error);
      alert(`Failed to export data: ${error}`);
    } finally {
      setBusy(false);
    }
  }, [isBusy, storageManager]);

  const handleImportClick = useCallback(() => {
    if (isBusy) { return; }
    refInput.current?.click();
  }, [isBusy]);

  const handleImportChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file == null) { return; }

    const ok = confirm('You are about to import data from a zip file.\n\nTHIS WILL OVERWRITE ALL EXISTING DATA IN THE APP, INCLUDING SETTINGS, MIDI MAPPINGS, DECK CODES, MEMORIES, SHADERS, AND ASSETS.\nIT IS STRONGLY RECOMMENDED TO BACK UP YOUR DATA BEFORE PROCEEDING.\n\nThe app will reload after importing. Continue?');
    if (!ok) { return; }

    setBusy(true);

    try {
      await importStorageArchive(storageManager, file);
      location.reload();
    } catch (error) {
      console.error(error);
      alert(`Failed to import data: ${error}`);
      setBusy(false);
    }
  }, [storageManager]);

  return (
    <>
      <SettingsItemButton
        name="Export Data"
        label={isBusy ? 'Working...' : 'Export'}
        onClick={handleExport}
        stalkerText="Download all the data stored in this Wavenerd instance as a zip file.&#10;Includes settings, MIDI mappings, deck codes, memories, shaders, and assets."
      />
      <SettingsItemButton
        name="Import Data"
        label={isBusy ? 'Working...' : 'Import'}
        onClick={handleImportClick}
        stalkerText="Load data from a zip file exported by Wavenerd.&#10;All existing data will be deleted and replaced with the contents of the zip file.&#10;The app will reload after importing."
      />
      <input
        ref={refInput}
        type="file"
        accept=".zip,application/zip"
        className="hidden"
        onChange={handleImportChange}
      />
    </>
  );
}
