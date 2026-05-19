import { PrintValue } from "../PrintValue.jsx";

export function DimensionsSection({ form, onFieldChange }) {
  return (
    <section className="form-section">
      <div className="section-title">Schurfabmessungen</div>
      <div className="dimensions-grid grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="field compact">
          <span>Länge l:</span>
          <input inputMode="decimal" value={form.laenge} onChange={(event) => onFieldChange("laenge", event.target.value)} placeholder="0,00" />
          <PrintValue value={form.laenge} />
          <em>m</em>
        </label>
        <label className="field compact">
          <span>Breite b:</span>
          <input inputMode="decimal" value={form.breite} onChange={(event) => onFieldChange("breite", event.target.value)} placeholder="0,00" />
          <PrintValue value={form.breite} />
          <em>m</em>
        </label>
        <label className="field compact">
          <span>Tiefe:</span>
          <input inputMode="decimal" value={form.tiefe} onChange={(event) => onFieldChange("tiefe", event.target.value)} placeholder="0,00" />
          <PrintValue value={form.tiefe} />
          <em>m</em>
        </label>
      </div>
    </section>
  );
}
