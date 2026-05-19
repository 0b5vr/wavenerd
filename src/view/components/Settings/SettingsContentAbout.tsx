export function SettingsContentAbout() {
  const hash = COMMIT_HASH.slice(0, 7);
  const date = new Date(COMMIT_DATE).toISOString().slice(0, 10);

  /* eslint-disable @stylistic/jsx-one-expression-per-line */

  return (
    <div className="px-4 text-xs">
      <h1 className="text-2xl font-bold m-0">Wavenerd</h1>
      <p className="m-0 mt-2">
        <code className="px-1 font-mono bg-input-back rounded">{hash}</code> ({date})
      </p>
      <p className="m-0 mt-2">
        Copyright (c) 2020-2026 0b5vr<br />
        Wavenerd is released under the MIT License<br />
        <a className="text-accent no-underline hover:underline" href="https://github.com/0b5vr/wavenerd" target="_blank" rel="noreferrer">https://github.com/0b5vr/wavenerd</a>
      </p>
    </div>
  );

  /* eslint-enable @stylistic/jsx-one-expression-per-line */
}
