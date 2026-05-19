import { PrintValue } from "../PrintValue.jsx";

export function LayersSection({ layers, onOpenAddDialog, onUpdateLayer, onRemoveLayer }) {
  return (
    <section className="form-section">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="section-title">Schichtenbeschreibung</h3>
        <button type="button" className="btn secondary print:hidden" onClick={onOpenAddDialog}>Schicht hinzufügen</button>
      </div>
      <div className="overflow-x-auto">
        <table className="layers-table">
          <thead>
            <tr>
              <th className="w-44">Teufe (u. GOK)</th>
              <th>Beschreibung</th>
              <th className="action-heading print:hidden"><span className="sr-only">Aktion</span></th>
            </tr>
          </thead>
          <tbody>
            {layers.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input inputMode="decimal" value={row.depth} onChange={(event) => onUpdateLayer(index, "depth", event.target.value)} placeholder="0,00" />
                  <PrintValue value={row.depth} />
                </td>
                <td>
                  <input value={row.description} onChange={(event) => onUpdateLayer(index, "description", event.target.value)} placeholder="Bodenbeschreibung" />
                  <PrintValue value={row.description} />
                </td>
                <td className="text-center print:hidden">
                  <button type="button" className="icon-button danger" onClick={() => onRemoveLayer(index)} aria-label="Schicht löschen" title="Schicht löschen">
                    <span aria-hidden="true">&#128465;</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {layers.length === 0 && <div className="empty-state print:hidden">Noch keine Schichten erfasst.</div>}
      </div>
      <p className="mt-1 text-xs text-neutral-600">u. GOK = unter Geländeoberkante</p>
    </section>
  );
}
