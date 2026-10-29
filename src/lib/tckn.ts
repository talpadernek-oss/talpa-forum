/** T.C. Kimlik No checksum (10th and 11th digit rules). */
export function isValidTCKN(tckn: string): boolean {
  const clean = (tckn || '').trim();
  if (!/^[1-9][0-9]{10}$/.test(clean)) return false;

  const d = clean.split('').map(Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  if (d[9] !== (((odd * 7 - even) % 10) + 10) % 10) return false;
  return d.slice(0, 10).reduce((a, b) => a + b, 0) % 10 === d[10];
}
