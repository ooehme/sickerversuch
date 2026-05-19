import { MathFormula } from "../MathFormula.jsx";
import { ScientificValue } from "../ScientificValue.jsx";

export function CalculationSection({ form, calculation }) {
  return (
    <section className="form-section calculation-section">
      <h3 className="section-title mb-2">Durchlässigkeitsbeiwert-Ermittlung</h3>
      <div className="calculation-grid grid gap-4 md:grid-cols-[1fr_280px]">
        <div>
          <MathFormula />
          <p className="mt-3 text-xs text-neutral-700">
            Berechnung je Versuch mit t = 3600 s, l = {form.laenge || "0"} m und b = {form.breite || "0"} m.
            Der angezeigte Endwert ist der Mittelwert der positiven k<sub>f</sub>-Werte.
          </p>
        </div>
        <div className="calculation-result space-y-3 self-start">
          <label className="field compact">
            <span>k<sub>f</sub> =</span>
            <output className="result-box">
              <ScientificValue value={calculation.avgKf} />
            </output>
            <em>m/s</em>
          </label>
          <p className="text-xs text-neutral-600">Versuche ohne messbare Absenkung werden beim Mittelwert nicht berücksichtigt.</p>
        </div>
      </div>
    </section>
  );
}
