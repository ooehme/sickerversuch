export function PrintValue({ value, className = "" }) {
  const text = String(value ?? "").trim();
  return <span className={`print-value ${className}`}>{text || "\u00a0"}</span>;
}
