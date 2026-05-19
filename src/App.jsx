import React, { useMemo, useRef, useState } from "react";

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const initialLayers = [];
const initialTests = [];

function parseDecimal(value) {
  if (value === null || value === undefined || value === "") return 0;
  return Number(String(value).trim().replace(",", ".")) || 0;
}

function formatDecimal(value, digits = 2) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(digits).replace(".", ",");
}

function formatScientific(value) {
  if (!Number.isFinite(value) || value <= 0) return "";
  return value.toExponential(3).replace(".", ",");
}

function calculateKfForTest({ length, width, seconds, start, end }) {
  const l = parseDecimal(length);
  const b = parseDecimal(width);
  const t = Number(seconds) || 0;
  const hStart = parseDecimal(start);
  const hEnd = parseDecimal(end);
  const drop = Math.max(0, hStart - hEnd);

  const wettedArea = l * b + 2 * (l + b) * (hEnd + drop / 2);
  const denominator = t * wettedArea;
  const kf = denominator > 0 ? (l * b * drop) / denominator : 0;
  const isEvaluable = kf > 0;

  return { hStart, hEnd, drop, wettedArea, kf, isEvaluable };
}

function calculateSickerversuch({ length, width, tests, seconds = 3600 }) {
  const rows = tests.map((row) =>
    calculateKfForTest({
      length,
      width,
      seconds,
      start: row.start,
      end: row.m60,
    })
  );

  const drops = rows.map((row) => row.drop);
  const kfValues = rows.map((row) => row.kf);
  const evaluableKfValues = kfValues.filter((value) => value > 0);
  const avgDrop = drops.length ? drops.reduce((sum, n) => sum + n, 0) / drops.length : 0;
  const avgStart = rows.length ? rows.reduce((sum, row) => sum + row.hStart, 0) / rows.length : 0;
  const avgEnd = rows.length ? rows.reduce((sum, row) => sum + row.hEnd, 0) / rows.length : 0;
  const avgKf = evaluableKfValues.length
    ? evaluableKfValues.reduce((sum, n) => sum + n, 0) / evaluableKfValues.length
    : 0;

  return { rows, drops, kfValues, evaluableKfValues, avgDrop, avgStart, avgEnd, avgKf, seconds };
}

function runCalculationTests() {
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
  console.assert(sample.drops.length === 3, "calculation returns one drop per test row");
  console.assert(sample.kfValues.length === 3, "calculation returns one kf value per test row");
  console.assert(sample.evaluableKfValues.length === 2, "zero kf values are excluded from mean kf calculation");
  console.assert(Math.abs(sample.avgDrop - 0.0066666667) < 0.000001, "average drop is calculated correctly");
  console.assert(single.kf > 0, "single-test kf is positive when water level drops");
  console.assert(zero.kf === 0 && zero.isEvaluable === false, "zero drop returns non-evaluable kf = 0");
  console.assert(sample.avgKf > 0 && sample.avgKf < 0.00001, "mean kf is positive and plausible for sample data");
}

if (typeof window !== "undefined" && !window.__sickerversuchTestsRun) {
  window.__sickerversuchTestsRun = true;
  runCalculationTests();
}

function MathFormula() {
  return (
    <div className="math-formula" aria-label="Formel für den Durchlässigkeitsbeiwert">
      <span className="formula-symbol">k<sub>f</sub> =</span>
      <span className="fraction main-fraction">
        <span className="top">l · b · (h<sub>Anf</sub> − h<sub>Ende</sub>)</span>
        <span className="bottom denominator">
          <span>t ·</span>
          <span className="large-bracket">[</span>
          <span>l · b +</span>
          <span className="large-brace">&#123;</span>
          <span>2 · (l + b) ·</span>
          <span className="large-paren">(</span>
          <span>h<sub>Ende</sub> +</span>
          <span className="fraction inline-fraction">
            <span className="top">h<sub>Anf</sub> − h<sub>Ende</sub></span>
            <span className="bottom">2</span>
          </span>
          <span className="large-paren">)</span>
          <span className="large-brace">&#125;</span>
          <span className="large-bracket">]</span>
        </span>
      </span>
      <span className="formula-unit">m/s</span>
    </div>
  );
}

function AddLayerDialog({ dialogRef, onAdd }) {
  const [depth, setDepth] = useState("");
  const [description, setDescription] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!depth.trim() && !description.trim()) return;
    onAdd({ id: makeId(), depth, description });
    setDepth("");
    setDescription("");
    dialogRef.current?.close();
  }

  return (
    <dialog ref={dialogRef} className="w-full max-w-xl rounded border border-neutral-400 p-0 shadow-xl backdrop:bg-black/30">
      <form onSubmit={submit} className="space-y-4 p-5">
        <h4 className="text-base font-semibold">Schicht hinzufügen</h4>
        <label className="dialog-field">
          <span>Teufe (u. GOK) in m</span>
          <input value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="z. B. 1,60" autoFocus />
        </label>
        <label className="dialog-field">
          <span>Beschreibung</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Bodenbeschreibung" rows={3} />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn secondary" onClick={() => dialogRef.current?.close()}>Abbrechen</button>
          <button type="submit" className="btn primary">Eintrag hinzufügen</button>
        </div>
      </form>
    </dialog>
  );
}

function AddTestDialog({ dialogRef, onAdd }) {
  const [row, setRow] = useState({ start: "", m15: "", m30: "", m45: "", m60: "" });

  function update(field, value) {
    setRow((prev) => ({ ...prev, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onAdd({ id: makeId(), ...row });
    setRow({ start: "", m15: "", m30: "", m45: "", m60: "" });
    dialogRef.current?.close();
  }

  return (
    <dialog ref={dialogRef} className="w-full max-w-2xl rounded border border-neutral-400 p-0 shadow-xl backdrop:bg-black/30">
      <form onSubmit={submit} className="space-y-4 p-5">
        <h4 className="text-base font-semibold">Sickertest-Eintrag hinzufügen</h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {[["start", "h Anfang"], ["m15", "15 min"], ["m30", "30 min"], ["m45", "45 min"], ["m60", "60 min / h Ende"]].map(([field, label]) => (
            <label key={field} className="dialog-field">
              <span>{label}</span>
              <input value={row[field]} onChange={(e) => update(field, e.target.value)} placeholder="0,67" />
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn secondary" onClick={() => dialogRef.current?.close()}>Abbrechen</button>
          <button type="submit" className="btn primary">Eintrag hinzufügen</button>
        </div>
      </form>
    </dialog>
  );
}

export default function SickerversuchFormular() {
  const layerDialogRef = useRef(null);
  const testDialogRef = useRef(null);

  const [form, setForm] = useState({
    flurstuecksnummer: "",
    gemarkung: "",
    laenge: "",
    breite: "",
    tiefe: "",
    wasserart: "",
    wasserTiefe: "",
    ort: "",
    datum: "",
  });

  const [layers, setLayers] = useState(initialLayers);
  const [tests, setTests] = useState(initialTests);

  const calculation = useMemo(
    () => calculateSickerversuch({ length: form.laenge, width: form.breite, tests }),
    [form.laenge, form.breite, tests]
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateLayer(index, field, value) {
    setLayers((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function updateTest(index, field, value) {
    setTests((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function removeLayer(index) {
    setLayers((prev) => prev.filter((_, i) => i !== index));
  }

  function removeTest(index) {
    setTests((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-4 text-neutral-950 print:bg-white print:p-0">
      <section className="a4-page mx-auto bg-white shadow print:shadow-none">
        <form className="form-layout">
          <h1 className="text-lg font-semibold">Protokoll über die Durchführung eines Sickerversuches</h1>

          <section className="form-section">
            <div className="section-title">Grunddaten</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="field">
                <span>Flurstücksnummer:</span>
                <input value={form.flurstuecksnummer} onChange={(e) => updateField("flurstuecksnummer", e.target.value)} placeholder="z. B. 1627/5" />
              </label>
              <label className="field">
                <span>Gemarkung:</span>
                <input value={form.gemarkung} onChange={(e) => updateField("gemarkung", e.target.value)} placeholder="Gemarkung" />
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-title">Schurfabmessungen</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="field compact"><span>Länge l:</span><input inputMode="decimal" value={form.laenge} onChange={(e) => updateField("laenge", e.target.value)} placeholder="0,00" /><em>m</em></label>
              <label className="field compact"><span>Breite b:</span><input inputMode="decimal" value={form.breite} onChange={(e) => updateField("breite", e.target.value)} placeholder="0,00" /><em>m</em></label>
              <label className="field compact"><span>Tiefe:</span><input inputMode="decimal" value={form.tiefe} onChange={(e) => updateField("tiefe", e.target.value)} placeholder="0,00" /><em>m</em></label>
            </div>
          </section>

          <section className="form-section space-y-2">
            <div className="section-title">Wasserführung</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {["Grundwasser", "Hangsickerwasser", "Schichtenwasser"].map((type) => (
                <label key={type} className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" checked={form.wasserart === type} onChange={() => updateField("wasserart", form.wasserart === type ? "" : type)} className="h-5 w-5" />
                  {type}
                </label>
              ))}
            </div>
            <label className="field compact max-w-md">
              <span>in einer Tiefe von:</span>
              <input inputMode="decimal" value={form.wasserTiefe} onChange={(e) => updateField("wasserTiefe", e.target.value)} placeholder="0,00" />
              <em>m u. GOK</em>
            </label>
          </section>

          <section className="form-section">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="section-title">Schichtenbeschreibung</h3>
              <button type="button" className="btn secondary print:hidden" onClick={() => layerDialogRef.current?.showModal()}>Schicht hinzufügen</button>
            </div>
            <div className="overflow-x-auto">
              <table>
                <thead><tr><th className="w-44">Teufe (u. GOK)</th><th>Beschreibung</th><th className="w-24 print:hidden">Aktion</th></tr></thead>
                <tbody>
                  {layers.map((row, index) => (
                    <tr key={row.id}>
                      <td><input inputMode="decimal" value={row.depth} onChange={(e) => updateLayer(index, "depth", e.target.value)} placeholder="0,00" /></td>
                      <td><input value={row.description} onChange={(e) => updateLayer(index, "description", e.target.value)} placeholder="Bodenbeschreibung" /></td>
                      <td className="text-center print:hidden"><button type="button" className="link-button" onClick={() => removeLayer(index)}>Löschen</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {layers.length === 0 && <div className="empty-state print:hidden">Noch keine Schichten erfasst.</div>}
            </div>
            <p className="mt-1 text-xs text-neutral-600">u. GOK = unter Geländeoberkante</p>
          </section>

          <section className="form-section">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="section-title">Dokumentation des Sickertestes</h3>
              <button type="button" className="btn secondary print:hidden" onClick={() => testDialogRef.current?.showModal()}>Versuch hinzufügen</button>
            </div>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr><th rowSpan="2">Versuch Nr.</th><th rowSpan="2">h<sub>Anf</sub></th><th colSpan="4">h nach</th><th rowSpan="2">h<sub>Anf</sub> − h<sub>Ende</sub></th><th rowSpan="2">k<sub>f</sub> Versuch</th><th rowSpan="2" className="print:hidden">Aktion</th></tr>
                  <tr><th>15 min</th><th>30 min</th><th>45 min</th><th>60 min / h<sub>Ende</sub></th></tr>
                </thead>
                <tbody>
                  {tests.map((row, index) => (
                    <tr key={row.id}>
                      <td className="text-center font-semibold">{index + 1}</td>
                      {["start", "m15", "m30", "m45", "m60"].map((field) => (
                        <td key={field}><input inputMode="decimal" value={row[field]} onChange={(e) => updateTest(index, field, e.target.value)} placeholder="0,00" /></td>
                      ))}
                      <td className="text-center">{formatDecimal(calculation.drops[index])} m</td>
                      <td className="text-center monospace-cell">{calculation.kfValues[index] > 0 ? formatScientific(calculation.kfValues[index]) : "—"}</td>
                      <td className="text-center print:hidden"><button type="button" className="link-button" onClick={() => removeTest(index)}>Löschen</button></td>
                    </tr>
                  ))}
                  <tr><td colSpan="6" className="text-right font-bold">Mittelwert</td><td className="text-center font-bold">{formatDecimal(calculation.avgDrop)} m</td><td className="text-center font-bold monospace-cell">{formatScientific(calculation.avgKf)}</td><td className="print:hidden" /></tr>
                </tbody>
              </table>
              {tests.length === 0 && <div className="empty-state print:hidden">Noch keine Sickertests erfasst.</div>}
            </div>
          </section>

          <section className="form-section calculation-section">
            <h3 className="section-title mb-2">Durchlässigkeitsbeiwert-Ermittlung</h3>
            <div className="grid gap-4 md:grid-cols-[1fr_280px]">
              <div>
                <MathFormula />
                <p className="mt-3 text-xs text-neutral-700">Berechnung je Versuch mit t = 3600 s, l = {form.laenge || "0"} m und b = {form.breite || "0"} m. Der angezeigte Endwert ist der Mittelwert der positiven k<sub>f</sub>-Werte.</p>
              </div>
              <div className="space-y-3 self-start">
                <label className="field compact"><span>k<sub>f</sub> =</span><output className="result-box">{formatScientific(calculation.avgKf)}</output><em>m/s</em></label>
                <p className="text-xs text-neutral-600">Versuche ohne messbare Absenkung werden beim Mittelwert nicht berücksichtigt.</p>
              </div>
            </div>
          </section>

          <section className="signature-section grid grid-cols-1 gap-8 pt-6 md:grid-cols-[2fr_1fr]">
            <div className="grid w-full grid-cols-2 gap-4">
              <label className="field"><span>Ort:</span><input value={form.ort} onChange={(e) => updateField("ort", e.target.value)} placeholder="Ort" /></label>
              <label className="field"><span>Datum:</span><input type="date" value={form.datum} onChange={(e) => updateField("datum", e.target.value)} /></label>
            </div>
            <div className="mt-10 w-full md:mt-0 md:self-end"><div className="border-b border-neutral-800 pt-8" /><p className="text-center text-xs">Unterschrift</p></div>
          </section>
        </form>

        <footer className="a4-footer">büro für baugrund und geologie · Alfred-Neubert-Str. 1 · 09123 Chemnitz · 0371 31592577 · info@buero-bg.de</footer>
      </section>

      <AddLayerDialog dialogRef={layerDialogRef} onAdd={(entry) => setLayers((prev) => [...prev, entry])} />
      <AddTestDialog dialogRef={testDialogRef} onAdd={(entry) => setTests((prev) => [...prev, entry])} />

      <style>{`
        @page { size: A4 portrait; margin: 0; }
        .a4-page { width: 210mm; min-height: 297mm; padding: 12mm; box-sizing: border-box; font-size: 0.74rem; line-height: 1.25; }
        .form-layout { display: grid; gap: 0.55rem; }
        .form-section { border: 1px solid #d4d4d4; border-radius: 0.35rem; padding: 0.55rem; background: #fff; }
        .section-title { margin-bottom: 0.35rem; font-weight: 650; letter-spacing: 0.01em; }
        .calculation-section { background: #fafafa; }
        .signature-section { border: 0; padding: 0; }
        .empty-state { border: 1px dashed #a3a3a3; border-top: 0; padding: 0.45rem; text-align: center; color: #737373; background: #fafafa; }
        .a4-footer { margin-top: 8mm; border-top: 1px solid #d4d4d4; padding-top: 2mm; text-align: center; font-size: 0.68rem; color: #525252; }
        .field { display: flex; align-items: center; gap: 0.25rem; font-weight: 600; }
        .field span { white-space: nowrap; }
        .field input, .field select, table input, .dialog-field input, .dialog-field textarea, .result-box { width: 100%; min-width: 0; border: 1px solid #a3a3a3; border-radius: 0.2rem; background: #f8fafc; padding: 0.22rem 0.4rem; font-weight: 500; transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease; }
        input:focus, textarea:focus { outline: none; border-color: #262626; box-shadow: 0 0 0 2px rgba(38, 38, 38, 0.12); background: #ffffff; }
        .result-box { display: inline-flex; min-height: 1.7rem; align-items: center; justify-content: center; background: #f8fafc; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .field.compact input, .field.compact output { max-width: 9rem; }
        .field em { font-style: normal; white-space: nowrap; }
        .dialog-field { display: grid; gap: 0.35rem; font-weight: 600; }
        .btn { border-radius: 999px; padding: 0.35rem 0.65rem; font-size: 0.75rem; font-weight: 600; transition: background 120ms ease, border-color 120ms ease, transform 120ms ease; }
        .btn:hover { transform: translateY(-1px); }
        .btn.primary { background: #171717; color: white; }
        .btn.secondary { border: 1px solid #737373; background: white; color: #171717; }
        .link-button { color: #991b1b; font-size: 0.72rem; font-weight: 600; text-decoration: none; }
        .link-button:hover { text-decoration: underline; }
        .monospace-cell { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 0.74rem; }
        table { width: 100%; border-collapse: collapse; font-size: 0.74rem; }
        th, td { border: 1px solid #6b7280; padding: 0.12rem; vertical-align: middle; }
        th { background: #e5e7eb; font-weight: 600; text-align: center; }
        td input { border: 0; background: #fff; padding: 0.2rem; }
        .math-formula { display: flex; align-items: center; gap: 0.35rem; overflow-x: auto; border: 1px solid #d4d4d4; background: #fafafa; padding: 0.55rem; white-space: nowrap; font-family: "Times New Roman", Times, serif; font-size: 0.78rem; }
        .formula-symbol, .formula-unit { font-weight: 600; }
        .fraction { display: inline-flex; flex-direction: column; align-items: stretch; text-align: center; vertical-align: middle; line-height: 1.45; }
        .main-fraction > .top { border-bottom: 1.8px solid #171717; padding: 0 0.75rem 0.18rem; }
        .main-fraction > .bottom { padding: 0.18rem 0.75rem 0; }
        .denominator { display: inline-flex; align-items: center; justify-content: center; gap: 0.18rem; }
        .large-bracket, .large-brace, .large-paren { display: inline-flex; align-items: center; justify-content: center; font-family: "Times New Roman", Times, serif; font-weight: 400; line-height: 1; }
        .large-bracket { font-size: 1.9rem; transform: scaleY(1.35); margin: 0 0.03rem; }
        .large-brace { font-size: 1.82rem; transform: scaleY(1.28); margin: 0 0.02rem; }
        .large-paren { font-size: 1.72rem; transform: scaleY(1.22); margin: 0 0.01rem; }
        .inline-fraction { display: inline-flex; flex-direction: column; align-items: stretch; text-align: center; vertical-align: middle; font-size: 0.82em; line-height: 1.15; transform: translateY(0.2em); }
        .inline-fraction > .top { border-bottom: 1px solid #171717; padding: 0 0.25rem 0.08rem; }
        .inline-fraction > .bottom { padding: 0.08rem 0.25rem 0; }
        @media print {
          input, select, textarea, .result-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          dialog, button, .print\:hidden { display: none !important; }
          .print\:bg-white { background: white !important; }
          .print\:p-0 { padding: 0 !important; }
          .print\:p-4 { padding: 1rem !important; }
          .print\:shadow-none { box-shadow: none !important; }
          .print\:rounded-none { border-radius: 0 !important; }
          .form-section { break-inside: avoid; border-color: #bdbdbd; }
          .empty-state { display: none !important; }
          .a4-page { width: 210mm !important; min-height: 297mm !important; padding: 10mm !important; box-shadow: none !important; }
          .print\:max-w-none { max-width: none !important; }
        }
      `}</style>
    </main>
  );
}
