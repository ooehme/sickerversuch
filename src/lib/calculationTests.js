import { calculateKfForTest, calculateSickerversuch, parseDecimal } from "./calculations.js";
import { formatDecimal, formatScientific } from "./format.js";

export function runCalculationTests() {
  const testRows = [
    { id: "test-1", start: "0,68", m15: "0,68", m30: "0,68", m45: "0,68", m60: "0,67" },
    { id: "test-2", start: "0,67", m15: "0,67", m30: "0,67", m45: "0,67", m60: "0,67" },
    { id: "test-3", start: "0,67", m15: "0,67", m30: "0,67", m45: "0,66", m60: "0,66" },
  ];

  const sample = calculateSickerversuch({ length: "1,05", width: "1,02", tests: testRows });
  const single = calculateKfForTest({ length: "1,05", width: "1,02", seconds: 3600, start: "0,68", end: "0,67" });
  const zero = calculateKfForTest({ length: "1,05", width: "1,02", seconds: 3600, start: "0,67", end: "0,67" });

  console.assert(parseDecimal("1,05") === 1.05, "parseDecimal handles comma decimals");
  console.assert(formatDecimal(0.01) === "0,01", "formatDecimal uses comma decimals");
  console.assert(formatScientific(0.00005051) === "5,051 * 10\u207b\u2075", "formatScientific uses readable power notation");
  console.assert(sample.drops.length === 3, "calculation returns one drop per test row");
  console.assert(sample.kfValues.length === 3, "calculation returns one kf value per test row");
  console.assert(sample.evaluableKfValues.length === 2, "zero kf values are excluded from mean kf calculation");
  console.assert(Math.abs(sample.avgDrop - 0.0066666667) < 0.000001, "average drop is calculated correctly");
  console.assert(single.kf > 0, "single-test kf is positive when water level drops");
  console.assert(zero.kf === 0 && zero.isEvaluable === false, "zero drop returns non-evaluable kf = 0");
  console.assert(sample.avgKf > 0 && sample.avgKf < 0.00001, "mean kf is positive and plausible for sample data");
}
