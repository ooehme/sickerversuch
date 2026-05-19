export function formatDecimal(value, digits = 2) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(digits).replace(".", ",");
}

export function formatScientific(value) {
  if (!Number.isFinite(value) || value <= 0) return "";
  return value.toExponential(3).replace(".", ",");
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
