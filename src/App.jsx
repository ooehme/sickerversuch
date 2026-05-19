import { useMemo, useRef, useState } from "react";
import { AddLayerDialog } from "./components/dialogs/AddLayerDialog.jsx";
import { AddTestDialog } from "./components/dialogs/AddTestDialog.jsx";
import { MobileView } from "./components/MobileView.jsx";
import { BasicDataSection } from "./components/sections/BasicDataSection.jsx";
import { CalculationSection } from "./components/sections/CalculationSection.jsx";
import { DimensionsSection } from "./components/sections/DimensionsSection.jsx";
import { LayersSection } from "./components/sections/LayersSection.jsx";
import { SignatureSection } from "./components/sections/SignatureSection.jsx";
import { TestsSection } from "./components/sections/TestsSection.jsx";
import { WaterSection } from "./components/sections/WaterSection.jsx";
import { createInitialWaterLevels } from "./constants/waterTypes.js";
import { usePrintMode } from "./hooks/usePrintMode.js";
import { calculateSickerversuch } from "./lib/calculations.js";
import { runCalculationTests } from "./lib/calculationTests.js";
import { formatDateInput } from "./lib/format.js";
import "./styles/form.css";

const initialLayers = [];
const initialTests = [];

function createInitialForm() {
  return {
    flurstuecksnummer: "",
    gemarkung: "",
    laenge: "",
    breite: "",
    tiefe: "",
    wasserfuehrung: createInitialWaterLevels(),
    ort: "",
    datum: formatDateInput(),
  };
}

if (typeof window !== "undefined" && !window.__sickerversuchTestsRun) {
  window.__sickerversuchTestsRun = true;
  runCalculationTests();
}

export default function SickerversuchFormular() {
  const layerDialogRef = useRef(null);
  const testDialogRef = useRef(null);
  const isPrintMode = usePrintMode();

  const [form, setForm] = useState(createInitialForm);
  const [layers, setLayers] = useState(initialLayers);
  const [tests, setTests] = useState(initialTests);

  const calculation = useMemo(
    () => calculateSickerversuch({ length: form.laenge, width: form.breite, tests }),
    [form.laenge, form.breite, tests]
  );

  const waterLevels = form.wasserfuehrung ?? createInitialWaterLevels();

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateWaterLevel(typeId, field, value) {
    setForm((prev) => {
      const currentWaterLevels = prev.wasserfuehrung ?? createInitialWaterLevels();
      return {
        ...prev,
        wasserfuehrung: {
          ...currentWaterLevels,
          [typeId]: {
            ...currentWaterLevels[typeId],
            [field]: value,
          },
        },
      };
    });
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

          <BasicDataSection form={form} onFieldChange={updateField} />
          <DimensionsSection form={form} onFieldChange={updateField} />
          <WaterSection waterLevels={waterLevels} onWaterLevelChange={updateWaterLevel} />
          <LayersSection
            layers={layers}
            onOpenAddDialog={() => layerDialogRef.current?.showModal()}
            onUpdateLayer={updateLayer}
            onRemoveLayer={removeLayer}
          />
          <TestsSection
            tests={tests}
            calculation={calculation}
            onOpenAddDialog={() => testDialogRef.current?.showModal()}
            onUpdateTest={updateTest}
            onRemoveTest={removeTest}
          />
          <CalculationSection form={form} calculation={calculation} />
          <SignatureSection form={form} isPrintMode={isPrintMode} onFieldChange={updateField} />
        </form>

        <footer className="a4-footer">büro für baugrund und geologie · Alfred-Neubert-Str. 1 · 09123 Chemnitz · 0371 31592577 · info@buero-bg.de</footer>
      </section>

      <MobileView
        form={form}
        waterLevels={waterLevels}
        layers={layers}
        tests={tests}
        calculation={calculation}
        isPrintMode={isPrintMode}
        onFieldChange={updateField}
        onWaterLevelChange={updateWaterLevel}
        onOpenLayerDialog={() => layerDialogRef.current?.showModal()}
        onOpenTestDialog={() => testDialogRef.current?.showModal()}
        onUpdateLayer={updateLayer}
        onUpdateTest={updateTest}
        onRemoveLayer={removeLayer}
        onRemoveTest={removeTest}
      />

      <AddLayerDialog dialogRef={layerDialogRef} onAdd={(entry) => setLayers((prev) => [...prev, entry])} />
      <AddTestDialog dialogRef={testDialogRef} onAdd={(entry) => setTests((prev) => [...prev, entry])} />
    </main>
  );
}
