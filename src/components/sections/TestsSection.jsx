import { formatDecimal } from "../../lib/format.js";
import { PrintValue } from "../PrintValue.jsx";
import { ScientificValue } from "../ScientificValue.jsx";

const TEST_FIELDS = ["start", "m15", "m30", "m45", "m60"];

export function TestsSection({ tests, calculation, onOpenAddDialog, onUpdateTest, onRemoveTest }) {
  return (
    <section className="form-section">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="section-title">Dokumentation des Sickertestes</h3>
        <button type="button" className="btn secondary print:hidden" onClick={onOpenAddDialog}>Versuch hinzufügen</button>
      </div>
      <div className="overflow-x-auto">
        <table className="test-table">
          <colgroup>
            <col className="test-number-col" />
            <col className="h-start-col" />
            <col className="water-level-col" span={4} />
            <col className="drop-col" />
            <col className="kf-col" />
            <col className="action-col" />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan="2">Versuch Nr.</th>
              <th rowSpan="2" className="h-start-header">h<sub>Anf</sub></th>
              <th colSpan="4">h nach</th>
              <th rowSpan="2">h<sub>Anf</sub> − h<sub>Ende</sub></th>
              <th rowSpan="2" className="kf-header">k<sub>f</sub> Versuch</th>
              <th rowSpan="2" className="action-heading print:hidden"><span className="sr-only">Aktion</span></th>
            </tr>
            <tr>
              <th>15 min</th>
              <th>30 min</th>
              <th>45 min</th>
              <th>60 min / h<sub>Ende</sub></th>
            </tr>
          </thead>
          <tbody>
            {tests.map((row, index) => (
              <tr key={row.id}>
                <td className="text-center font-semibold">{index + 1}</td>
                {TEST_FIELDS.map((field) => (
                  <td key={field} className={field === "start" ? "h-start-cell" : undefined}>
                    <input inputMode="decimal" value={row[field]} onChange={(event) => onUpdateTest(index, field, event.target.value)} placeholder="0,00" />
                    <PrintValue value={row[field]} />
                  </td>
                ))}
                <td className="text-center">{formatDecimal(calculation.drops[index])} m</td>
                <td className="text-center monospace-cell kf-cell">
                  {calculation.kfValues[index] > 0 ? <ScientificValue value={calculation.kfValues[index]} /> : "—"}
                </td>
                <td className="text-center print:hidden">
                  <button type="button" className="icon-button danger" onClick={() => onRemoveTest(index)} aria-label="Versuch löschen" title="Versuch löschen">
                    <span aria-hidden="true">&#128465;</span>
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="6" className="text-right font-bold">Mittelwert</td>
              <td className="text-center font-bold">{formatDecimal(calculation.avgDrop)} m</td>
              <td className="text-center font-bold monospace-cell">
                <ScientificValue value={calculation.avgKf} />
              </td>
              <td className="print:hidden" />
            </tr>
          </tbody>
        </table>
        {tests.length === 0 && <div className="empty-state print:hidden">Noch keine Sickertests erfasst.</div>}
      </div>
    </section>
  );
}
