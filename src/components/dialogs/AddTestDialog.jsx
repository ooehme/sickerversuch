import { useState } from "react";
import { makeId } from "../../lib/id.js";

const TEST_FIELDS = [
  ["start", "h Anfang"],
  ["m15", "15 min"],
  ["m30", "30 min"],
  ["m45", "45 min"],
  ["m60", "60 min / h Ende"],
];

const emptyTestRow = { start: "", m15: "", m30: "", m45: "", m60: "" };

export function AddTestDialog({ dialogRef, onAdd }) {
  const [row, setRow] = useState(emptyTestRow);

  function update(field, value) {
    setRow((prev) => ({ ...prev, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onAdd({ id: makeId(), ...row });
    setRow(emptyTestRow);
    dialogRef.current?.close();
  }

  return (
    <dialog ref={dialogRef} className="w-full max-w-2xl rounded border border-neutral-400 p-0 shadow-xl backdrop:bg-black/30">
      <form onSubmit={submit} className="space-y-4 p-5">
        <h4 className="text-base font-semibold">Sickertest-Eintrag hinzufügen</h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {TEST_FIELDS.map(([field, label]) => (
            <label key={field} className="dialog-field">
              <span>{label}</span>
              <input value={row[field]} onChange={(event) => update(field, event.target.value)} placeholder="0,67" />
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
