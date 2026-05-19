export function formatDecimal(value, digits = 2) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(digits).replace(".", ",");
}

export function formatScientific(value) {
  const parts = formatScientificParts(value);
  if (!parts) return "";
  return `${parts.mantissa} * 10${formatSuperscript(parts.exponent)}`;
}

export function formatScientificParts(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  const [mantissa, exponent] = value.toExponential(3).split("e");
  return {
    mantissa: mantissa.replace(".", ","),
    exponent: String(Number(exponent)),
  };
}

function formatSuperscript(value) {
  const superscriptDigits = {
    "-": "\u207b",
    0: "\u2070",
    1: "\u00b9",
    2: "\u00b2",
    3: "\u00b3",
    4: "\u2074",
    5: "\u2075",
    6: "\u2076",
    7: "\u2077",
    8: "\u2078",
    9: "\u2079",
  };

  return String(value)
    .split("")
    .map((character) => superscriptDigits[character] ?? character)
    .join("");
}

export function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}.${month}.${year}`;
}

export function formatDateInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
