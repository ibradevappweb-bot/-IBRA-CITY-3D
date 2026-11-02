import * as THREE from "three";
import { GameScene } from "./Scene";
import { GameRenderer } from "./Renderer";
import {
  GRAPHICS_PROFILES,
  type GraphicsQuality,
} from "./GraphicsSettings";

export class Game {
  private readonly world: GameScene;
  private readonly view: GameRenderer;
  private animationFrame = 0;
  private previousTime = 0;
  private running = false;

  constructor(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    quality: GraphicsQuality,
  ) {
    this.world = new GameScene(container);
    this.view = new GameRenderer(canvas, quality);
    this.applyQuality(quality);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.previousTime = 0;
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
  }

  applyQuality(quality: GraphicsQuality): void {
    this.view.applyQuality(quality);
    const profile = GRAPHICS_PROFILES[quality];
    const light = this.world.scene.children.find(
      (child): child is THREE.DirectionalLight =>
        child instanceof THREE.DirectionalLight,
    );
    if (light) light.castShadow = profile.shadows;
  }

  private readonly animate = (time: number): void => {
    if (!this.running) return;
    const delta = this.previousTime === 0
      ? 0
      : Math.min((time - this.previousTime) / 1000, 0.05);
    this.previousTime = time;

    // The first scene is a technical test environment; gameplay comes later.
    void delta;
    this.view.render(this.world.scene, this.world.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  dispose(): void {
    this.stop();
    this.world.dispose();
    this.view.dispose();
  }
}
