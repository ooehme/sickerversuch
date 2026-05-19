import { formatScientificParts } from "../lib/format.js";

export function ScientificValue({ value, fallback = "" }) {
  const parts = formatScientificParts(value);
  if (!parts) return fallback;

  return (
    <span className="scientific-value">
      {parts.mantissa} * 10<sup>{parts.exponent}</sup>
    </span>
  );
}
