export class MainMenu {
  private readonly menu: HTMLElement;
  private readonly gameScreen: HTMLElement;
  private readonly onPlay: () => void;
  private readonly onExit: () => void;

  constructor(onPlay: () => void, onExit: () => void) {
    this.menu = document.querySelector<HTMLElement>(".shell") ?? this.requireElement("app");
    this.gameScreen = this.requireElement("game-screen");
    this.onPlay = onPlay;
    this.onExit = onExit;

    this.requireElement("play-button").addEventListener("click", () => this.showGame());
    this.requireElement("exit-game").addEventListener("click", () => this.showMenu());
  }

  showGame(): void {
    this.menu.hidden = true;
    this.gameScreen.hidden = false;
    this.onPlay();
  }

  showMenu(): void {
    this.onExit();
    this.gameScreen.hidden = true;
    this.menu.hidden = false;
  }

  private requireElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Élément HTML introuvable : #${id}`);
    return element;
  }
}
