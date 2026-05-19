import { useEffect, useState } from "react";

export function usePrintMode() {
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const printQuery = window.matchMedia("print");
    const updatePrintMode = () => setIsPrintMode(printQuery.matches);
    const beforePrint = () => setIsPrintMode(true);
    const afterPrint = () => setIsPrintMode(false);

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    printQuery.addEventListener?.("change", updatePrintMode);
    updatePrintMode();

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      printQuery.removeEventListener?.("change", updatePrintMode);
    };
  }, []);

  return isPrintMode;
}
