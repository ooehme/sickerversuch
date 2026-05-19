export const WATER_TYPES = [
  { id: "grundwasser", label: "Grundwasser" },
  { id: "hangsickerwasser", label: "Hangsickerwasser" },
  { id: "schichtenwasser", label: "Schichtenwasser" },
];

export function createInitialWaterLevels() {
  return WATER_TYPES.reduce((levels, type) => {
    levels[type.id] = { checked: false, depth: "" };
    return levels;
  }, {});
}
