import {
  getSavedGraphicsQuality,
  saveGraphicsQuality,
  type GraphicsQuality,
} from "../core/GraphicsSettings";

export class SettingsPanel {
  private readonly panel: HTMLElement;
  private readonly feedback: HTMLElement;
  private readonly options: NodeListOf<HTMLButtonElement>;
  private readonly onQualityChange: (quality: GraphicsQuality) => void;

  constructor(onQualityChange: (quality: GraphicsQuality) => void) {
    this.panel = this.getElement("settings-panel");
    this.feedback = this.getElement("settings-feedback");
    this.options = document.querySelectorAll<HTMLButtonElement>("[data-quality]");
    this.onQualityChange = onQualityChange;

    this.getElement("settings-button").addEventListener("click", () => this.open());
    this.getElement("close-settings").addEventListener("click", () => this.close());

    this.options.forEach((option) => {
      option.addEventListener("click", () => {
        const quality = option.dataset.quality;
        if (quality === "low" || quality === "balanced" || quality === "high") {
          this.selectQuality(quality);
        }
      });
    });

    this.updateSelection(getSavedGraphicsQuality());
  }

  open(): void {
    this.panel.hidden = false;
  }

  close(): void {
    this.panel.hidden = true;
  }

  private selectQuality(quality: GraphicsQuality): void {
    saveGraphicsQuality(quality);
    this.updateSelection(quality);
    this.onQualityChange(quality);
    this.feedback.textContent = `Profil sélectionné : ${qualityLabel(quality)}.`;
  }

  private updateSelection(quality: GraphicsQuality): void {
    this.options.forEach((option) => {
      const selected = option.dataset.quality === quality;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
  }

  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Élément HTML introuvable : #${id}`);
    return element;
  }
}

function qualityLabel(quality: GraphicsQuality): string {
  if (quality === "low") return "Économique";
  if (quality === "high") return "Qualité";
  return "Équilibré";
}
