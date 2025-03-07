export function voltageToDisplayDB(voltage: number): string {
  if (voltage === 0.0) {
    return '-INF dB';
  } else {
    const db = 20.0 * Math.log10(voltage);
    return db.toFixed(2) + ' dB';
  }
}
