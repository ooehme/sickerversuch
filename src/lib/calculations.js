export function parseDecimal(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(String(value).trim().replace(",", ".")) || 0;
}

export function calculateKfForTest({ length, width, seconds, start, end }) {
  const l = parseDecimal(length);
  const b = parseDecimal(width);
  const t = Number(seconds) || 0;
  const hStart = parseDecimal(start);
  const hEnd = parseDecimal(end);
  const drop = Math.max(0, hStart - hEnd);

  const wettedArea = l * b + 2 * (l + b) * (hEnd + drop / 2);
  const denominator = t * wettedArea;
  const kf = denominator > 0 ? (l * b * drop) / denominator : 0;
  const isEvaluable = kf > 0;

  return { hStart, hEnd, drop, wettedArea, kf, isEvaluable };
}

export function calculateSickerversuch({ length, width, tests, seconds = 3600 }) {
  const rows = tests.map((row) =>
    calculateKfForTest({
      length,
      width,
      seconds,
      start: row.start,
      end: row.m60,
    })
  );

  const drops = rows.map((row) => row.drop);
  const kfValues = rows.map((row) => row.kf);
  const evaluableKfValues = kfValues.filter((value) => value > 0);
  const avgDrop = drops.length ? drops.reduce((sum, n) => sum + n, 0) / drops.length : 0;
  const avgStart = rows.length ? rows.reduce((sum, row) => sum + row.hStart, 0) / rows.length : 0;
  const avgEnd = rows.length ? rows.reduce((sum, row) => sum + row.hEnd, 0) / rows.length : 0;
  const avgKf = evaluableKfValues.length
    ? evaluableKfValues.reduce((sum, n) => sum + n, 0) / evaluableKfValues.length
    : 0;

  return { rows, drops, kfValues, evaluableKfValues, avgDrop, avgStart, avgEnd, avgKf, seconds };
}
