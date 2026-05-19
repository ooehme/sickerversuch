import { WATER_TYPES } from "../constants/waterTypes.js";
import { formatDecimal, formatScientific } from "../lib/format.js";

const TEST_FIELDS = [
  ["start", "Anfang"],
  ["m15", "15 min"],
  ["m30", "30 min"],
  ["m45", "45 min"],
  ["m60", "60 min"],
];

function MobileField({ label, children }) {
  return (
    <label className="mobile-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function MobileSection({ title, action, children }) {
  return (
    <section className="mobile-section">
      <div className="mobile-section-header">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function MobileView({
  form,
  waterLevels,
  layers,
  tests,
  calculation,
  isPrintMode,
  onFieldChange,
  onWaterLevelChange,
  onOpenLayerDialog,
  onOpenTestDialog,
  onUpdateLayer,
  onUpdateTest,
  onRemoveLayer,
  onRemoveTest,
}) {
  return (
    <div className="mobile-page" aria-label="Mobile Formularansicht">
      <header className="mobile-header">
        <div>
          <p>Sickerversuch</p>
          <h1>Protokoll</h1>
        </div>
      </header>

      <MobileSection title="Grunddaten">
        <div className="mobile-field-grid">
          <MobileField label="Flurstücksnummer">
            <input value={form.flurstuecksnummer} onChange={(event) => onFieldChange("flurstuecksnummer", event.target.value)} placeholder="z. B. 1627/5" />
          </MobileField>
          <MobileField label="Gemarkung">
            <input value={form.gemarkung} onChange={(event) => onFieldChange("gemarkung", event.target.value)} placeholder="Gemarkung" />
          </MobileField>
        </div>
      </MobileSection>

      <MobileSection title="Schurfabmessungen">
        <div className="mobile-field-grid three">
          <MobileField label="Länge l">
            <div className="mobile-unit-input">
              <input inputMode="decimal" value={form.laenge} onChange={(event) => onFieldChange("laenge", event.target.value)} placeholder="0,00" />
              <span>m</span>
            </div>
          </MobileField>
          <MobileField label="Breite b">
            <div className="mobile-unit-input">
              <input inputMode="decimal" value={form.breite} onChange={(event) => onFieldChange("breite", event.target.value)} placeholder="0,00" />
              <span>m</span>
            </div>
          </MobileField>
          <MobileField label="Tiefe">
            <div className="mobile-unit-input">
              <input inputMode="decimal" value={form.tiefe} onChange={(event) => onFieldChange("tiefe", event.target.value)} placeholder="0,00" />
              <span>m</span>
            </div>
          </MobileField>
        </div>
      </MobileSection>

      <MobileSection title="Wasserführung">
        <div className="mobile-water-list">
          {WATER_TYPES.map((type) => (
            <div key={type.id} className="mobile-water-card">
              <label className="mobile-check-row">
                <input
                  type="checkbox"
                  checked={waterLevels[type.id].checked}
                  onChange={(event) => onWaterLevelChange(type.id, "checked", event.target.checked)}
                />
                <span>{type.label}</span>
              </label>
              <MobileField label="Tiefe">
                <div className="mobile-unit-input">
                  <input
                    inputMode="decimal"
                    value={waterLevels[type.id].depth}
                    onChange={(event) => onWaterLevelChange(type.id, "depth", event.target.value)}
                    placeholder="0,00"
                    disabled={!waterLevels[type.id].checked}
                  />
                  <span>m u. GOK</span>
                </div>
              </MobileField>
            </div>
          ))}
        </div>
      </MobileSection>

      <MobileSection
        title="Schichten"
        action={
          <button type="button" className="mobile-secondary-button" onClick={onOpenLayerDialog}>
            Hinzufügen
          </button>
        }
      >
        {layers.length === 0 ? (
          <div className="mobile-empty">Noch keine Schichten erfasst.</div>
        ) : (
          <div className="mobile-card-list">
            {layers.map((row, index) => (
              <article key={row.id} className="mobile-record-card">
                <div className="mobile-record-title">
                  <strong>Schicht {index + 1}</strong>
                  <button type="button" className="mobile-icon-button danger" onClick={() => onRemoveLayer(index)} aria-label="Schicht löschen">
                    &#128465;
                  </button>
                </div>
                <MobileField label="Teufe (u. GOK)">
                  <input inputMode="decimal" value={row.depth} onChange={(event) => onUpdateLayer(index, "depth", event.target.value)} placeholder="0,00" />
                </MobileField>
                <MobileField label="Beschreibung">
                  <input value={row.description} onChange={(event) => onUpdateLayer(index, "description", event.target.value)} placeholder="Bodenbeschreibung" />
                </MobileField>
              </article>
            ))}
          </div>
        )}
      </MobileSection>

      <MobileSection
        title="Sickertests"
        action={
          <button type="button" className="mobile-secondary-button" onClick={onOpenTestDialog}>
            Hinzufügen
          </button>
        }
      >
        {tests.length === 0 ? (
          <div className="mobile-empty">Noch keine Sickertests erfasst.</div>
        ) : (
          <div className="mobile-card-list">
            {tests.map((row, index) => (
              <article key={row.id} className="mobile-record-card">
                <div className="mobile-record-title">
                  <strong>Versuch {index + 1}</strong>
                  <button type="button" className="mobile-icon-button danger" onClick={() => onRemoveTest(index)} aria-label="Versuch löschen">
                    &#128465;
                  </button>
                </div>
                <div className="mobile-test-grid">
                  {TEST_FIELDS.map(([field, label]) => (
                    <MobileField key={field} label={label}>
                      <input inputMode="decimal" value={row[field]} onChange={(event) => onUpdateTest(index, field, event.target.value)} placeholder="0,00" />
                    </MobileField>
                  ))}
                </div>
                <div className="mobile-result-row">
                  <span>Absenkung</span>
                  <strong>{formatDecimal(calculation.drops[index])} m</strong>
                </div>
                <div className="mobile-result-row">
                  <span>k<sub>f</sub> Versuch</span>
                  <strong>{calculation.kfValues[index] > 0 ? formatScientific(calculation.kfValues[index]) : "—"}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </MobileSection>

      <MobileSection title="Ergebnis">
        <div className="mobile-summary-grid">
          <div>
            <span>Mittlere Absenkung</span>
            <strong>{formatDecimal(calculation.avgDrop)} m</strong>
          </div>
          <div>
            <span>k<sub>f</sub></span>
            <strong>{formatScientific(calculation.avgKf) || "—"} m/s</strong>
          </div>
        </div>
      </MobileSection>

      <MobileSection title="Abschluss">
        <div className="mobile-field-grid">
          <MobileField label="Ort">
            <input value={form.ort} onChange={(event) => onFieldChange("ort", event.target.value)} placeholder="Ort" />
          </MobileField>
          <MobileField label="Datum">
            <input type="date" value={form.datum} onChange={(event) => onFieldChange("datum", event.target.value)} />
          </MobileField>
        </div>
      </MobileSection>

      {!isPrintMode && (
        <div className="mobile-print-actions">
          <button type="button" className="mobile-print-button" onClick={() => window.print()}>
            Drucken
          </button>
        </div>
      )}
    </div>
  );
}
