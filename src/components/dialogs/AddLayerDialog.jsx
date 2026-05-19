import { useState } from "react";
import { makeId } from "../../lib/id.js";

export function AddLayerDialog({ dialogRef, onAdd }) {
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
          <input value={depth} onChange={(event) => setDepth(event.target.value)} placeholder="z. B. 1,60" autoFocus />
        </label>
        <label className="dialog-field">
          <span>Beschreibung</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Bodenbeschreibung" rows={3} />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn secondary" onClick={() => dialogRef.current?.close()}>Abbrechen</button>
          <button type="submit" className="btn primary">Eintrag hinzufügen</button>
        </div>
      </form>
    </dialog>
  );
}
