import { PrintValue } from "../PrintValue.jsx";

export function BasicDataSection({ form, onFieldChange }) {
  return (
    <section className="form-section">
      <div className="section-title">Grunddaten</div>
      <div className="basic-data-grid grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="field">
          <span>Flurstücksnummer:</span>
          <input value={form.flurstuecksnummer} onChange={(event) => onFieldChange("flurstuecksnummer", event.target.value)} placeholder="z. B. 1627/5" />
          <PrintValue value={form.flurstuecksnummer} />
        </label>
        <label className="field">
          <span>Gemarkung:</span>
          <input value={form.gemarkung} onChange={(event) => onFieldChange("gemarkung", event.target.value)} placeholder="Gemarkung" />
          <PrintValue value={form.gemarkung} />
        </label>
      </div>
    </section>
  );
}
