import { formatDate } from "../../lib/format.js";
import { PrintValue } from "../PrintValue.jsx";

export function SignatureSection({ form, isPrintMode, onFieldChange }) {
  return (
    <section className="signature-section grid grid-cols-1 gap-8 pt-6 md:grid-cols-[2fr_1fr]">
      <div className="signature-fields grid w-full grid-cols-2 gap-4">
        <label className="field">
          <span>Ort:</span>
          <input value={form.ort} onChange={(event) => onFieldChange("ort", event.target.value)} placeholder="Ort" />
          <PrintValue value={form.ort} />
        </label>
        <label className="field">
          <span>Datum:</span>
          <input type="date" value={form.datum} onChange={(event) => onFieldChange("datum", event.target.value)} />
          <PrintValue value={formatDate(form.datum)} />
        </label>
      </div>
      <p className="place-date-print print-only">{form.ort || "\u00a0"}, den {formatDate(form.datum) || "\u00a0"}.</p>
      {!isPrintMode && <button type="button" className="screen-only print-button btn primary md:self-end" onClick={() => window.print()}>Drucken</button>}
      <div className="signature-box print-only">
        <div className="border-b border-neutral-800 pt-8" />
        <p className="text-center text-xs">Unterschrift</p>
      </div>
    </section>
  );
}
