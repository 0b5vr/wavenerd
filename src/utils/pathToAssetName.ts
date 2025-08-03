export function pathToAssetName(path: string): string {
  const filename = path.split('/').pop() || '';

  const splitted = filename.split('.');
  splitted.pop(); // remove the file extension
  let sanitized = splitted.join('_');

  // replace any non-alphanumeric characters with underscores
  sanitized = sanitized.replace(/[^0-9a-zA-Z_]/g, '_');

  return sanitized;
}
