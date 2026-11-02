export type GraphicsQuality = "low" | "balanced" | "high";

export interface GraphicsProfile {
  label: string;
  pixelRatioCap: number;
  shadows: boolean;
  antialias: boolean;
  toneMappingExposure: number;
}

export const GRAPHICS_PROFILES: Record<GraphicsQuality, GraphicsProfile> = {
  low: {
    label: "Économique",
    pixelRatioCap: 1,
    shadows: false,
    antialias: false,
    toneMappingExposure: 1,
  },
  balanced: {
    label: "Équilibré",
    pixelRatioCap: 1.5,
    shadows: true,
    antialias: true,
    toneMappingExposure: 1,
  },
  high: {
    label: "Qualité",
    pixelRatioCap: 2,
    shadows: true,
    antialias: true,
    toneMappingExposure: 1.05,
  },
};

const STORAGE_KEY = "ibra-city-3d:graphics-quality";

export function getSavedGraphicsQuality(): GraphicsQuality {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "low" || saved === "balanced" || saved === "high") {
      return saved;
    }
  } catch {
    // Storage may be unavailable in private or restricted browsing modes.
  }
  return "balanced";
}

export function saveGraphicsQuality(quality: GraphicsQuality): void {
  try {
    localStorage.setItem(STORAGE_KEY, quality);
  } catch {
    // The game remains usable even when preferences cannot be persisted.
  }
}
