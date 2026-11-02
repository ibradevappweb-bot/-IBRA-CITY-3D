import "./styles/main.css";
import { Game } from "./core/Game";
import {
  getSavedGraphicsQuality,
  type GraphicsQuality,
} from "./core/GraphicsSettings";
import { MainMenu } from "./ui/Menu";
import { SettingsPanel } from "./ui/Settings";

const gameContainer = document.getElementById("game-screen");
const canvas = document.getElementById("game-canvas");

if (!(gameContainer instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Impossible d'initialiser IBRA CITY 3D : conteneur ou canvas absent.");
}

// Keep explicitly typed references for use inside callbacks.
const gameRoot: HTMLElement = gameContainer;
const gameCanvas: HTMLCanvasElement = canvas;

let selectedQuality: GraphicsQuality = getSavedGraphicsQuality();
let game: Game | null = null;

function createGame(): Game {
  return new Game(gameRoot, gameCanvas, selectedQuality);
}

const menu = new MainMenu(
  () => {
    game ??= createGame();
    game.start();
  },
  () => game?.stop(),
);

const settings = new SettingsPanel((quality) => {
  selectedQuality = quality;
  game?.applyQuality(quality);
});

window.addEventListener("pagehide", () => {
  game?.dispose();
});

void menu;
void settings;
