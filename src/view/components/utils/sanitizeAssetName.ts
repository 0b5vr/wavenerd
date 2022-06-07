export function sanitizeAssetName( raw: string ): string | null {
  if ( raw.match( /^[0-9a-zA-Z_]+$/ ) ) {
    return raw;
  }

  return null;
}
