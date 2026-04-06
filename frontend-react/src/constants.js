// ── API endpoint ─────────────────────────────────────────────────────────────
// Reads from VITE_API_BASE env var at build time (set in Vercel project settings).
// Falls back to the production HF Space URL so local dev works without .env.
export const API_BASE =
  import.meta.env.VITE_API_BASE ??
  "https://girimayur-styleshift-backend.hf.space";

// ── Model metadata: emoji + readable label ────────────────────────────────────
// Keep in sync with MODEL_REGISTRY in hf_space/model_registry.py
export const MODEL_META = {
  horse2zebra:             { emoji: "🐴→🦓", label: "Horse → Zebra" },
  zebra2horse:             { emoji: "🦓→🐴", label: "Zebra → Horse" },
  apple2orange:            { emoji: "🍎→🍊", label: "Apple → Orange" },
  orange2apple:            { emoji: "🍊→🍎", label: "Orange → Apple" },
  summer2winter_yosemite:  { emoji: "☀️→❄️",  label: "Summer → Winter" },
  winter2summer_yosemite:  { emoji: "❄️→☀️",  label: "Winter → Summer" },
  map2sat:                 { emoji: "🗺️→🛰️", label: "Map → Satellite" },
  sat2map:                 { emoji: "🛰️→🗺️", label: "Satellite → Map" },
  cityscapes_label2photo:  { emoji: "🏷️→🏙️", label: "Label → Photo (Cityscapes)" },
  facades_label2photo:     { emoji: "🏷️→🏠", label: "Label → Facades" },
};

export const getMeta = (name) =>
  MODEL_META[name] ?? { emoji: "🔄", label: name };
