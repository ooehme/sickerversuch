import { WATER_TYPES } from "../../constants/waterTypes.js";
import { PrintValue } from "../PrintValue.jsx";

export function WaterSection({ waterLevels, onWaterLevelChange }) {
  return (
    <section className="form-section space-y-2">
      <div className="section-title">Wasserführung</div>
      <div className="water-options grid grid-cols-1 gap-3 md:grid-cols-3">
        {WATER_TYPES.map((type) => (
          <label key={type.id} className="water-option">
            <span className="water-option-heading">
              <input
                type="checkbox"
                checked={waterLevels[type.id].checked}
                onChange={(event) => onWaterLevelChange(type.id, "checked", event.target.checked)}
                className="h-5 w-5"
              />
              <span>{type.label}</span>
            </span>
            <span className="water-depth-control">
              <input
                inputMode="decimal"
                value={waterLevels[type.id].depth}
                onChange={(event) => onWaterLevelChange(type.id, "depth", event.target.value)}
                placeholder="0,00"
                disabled={!waterLevels[type.id].checked}
              />
              <em>m u. GOK</em>
            </span>
          </label>
        ))}
      </div>
      <div className="water-print-summary print-only">
        {WATER_TYPES.map((type) => (
          <div key={type.id} className="water-print-card">
            <div className="water-print-title">{type.label}</div>
            <label className="field compact">
              <span>Tiefe:</span>
              <PrintValue value={waterLevels[type.id].checked ? waterLevels[type.id].depth : ""} />
              <em>m u. GOK</em>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
