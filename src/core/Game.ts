import * as THREE from "three";
import { GameScene } from "./Scene";
import { GameRenderer } from "./Renderer";
import { PlayerCar } from "./Vehicle";
import { GRAPHICS_PROFILES, type GraphicsQuality } from "./GraphicsSettings";

export class Game {
  private readonly world: GameScene;
  private readonly view: GameRenderer;
  private readonly car = new PlayerCar();
  private animationFrame = 0;
  private previousTime = 0;
  private running = false;
  private speed = 0;
  private steering = 0;
  private readonly keys = new Set<string>();
  private readonly pressed = new Set<string>();

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, quality: GraphicsQuality) {
    this.world = new GameScene(container);
    this.view = new GameRenderer(canvas, quality);
    this.world.scene.add(this.car.root);
    this.car.root.position.y = 0.04;
    this.bindControls();
    this.applyQuality(quality);
  }

  private bindControls(): void {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    document.querySelectorAll<HTMLElement>("[data-drive]").forEach((button) => {
      const action = button.dataset.drive!;
      const down = (event: Event) => { event.preventDefault(); this.pressed.add(action); };
      const up = (event: Event) => { event.preventDefault(); this.pressed.delete(action); };
      button.addEventListener("pointerdown", down);
      button.addEventListener("pointerup", up);
      button.addEventListener("pointercancel", up);
      button.addEventListener("pointerleave", up);
    });
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
    this.keys.add(event.key.toLowerCase());
  };
  private readonly onKeyUp = (event: KeyboardEvent): void => { this.keys.delete(event.key.toLowerCase()); };

  start(): void {
    if (this.running) return;
    this.running = true; this.previousTime = 0;
    this.animationFrame = requestAnimationFrame(this.animate);
  }
  stop(): void { this.running = false; cancelAnimationFrame(this.animationFrame); }
  applyQuality(quality: GraphicsQuality): void {
    this.view.applyQuality(quality);
    const profile = GRAPHICS_PROFILES[quality];
    const light = this.world.scene.children.find((child): child is THREE.DirectionalLight => child instanceof THREE.DirectionalLight);
    if (light) light.castShadow = profile.shadows;
  }

  private isDown(...names: string[]): boolean {
    return names.some((name) => this.keys.has(name) || this.pressed.has(name));
  }

  private readonly animate = (time: number): void => {
    if (!this.running) return;
    const dt = this.previousTime === 0 ? 0 : Math.min((time - this.previousTime) / 1000, 0.04);
    this.previousTime = time;
    const throttle = this.isDown("w", "arrowup", "accelerate") ? 1 : 0;
    const brake = this.isDown("s", "arrowdown", "brake") ? 1 : 0;
    const left = this.isDown("a", "arrowleft", "left") ? 1 : 0;
    const right = this.isDown("d", "arrowright", "right") ? 1 : 0;
    this.speed += throttle * 9 * dt;
    this.speed -= brake * 14 * dt;
    if (!throttle && !brake) this.speed *= Math.exp(-1.25 * dt);
    this.speed = THREE.MathUtils.clamp(this.speed, -5, 24);
    const targetSteer = right - left;
    this.steering = THREE.MathUtils.damp(this.steering, targetSteer, 7, dt);
    const steerFactor = THREE.MathUtils.clamp(Math.abs(this.speed) / 5, 0, 1);
    this.car.root.rotation.y -= this.steering * steerFactor * this.speed * 0.055 * dt;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.car.root.quaternion);
    this.car.root.position.addScaledVector(forward, this.speed * dt);
    this.car.updateWheels(this.speed * dt, this.steering);
    const cameraOffset = new THREE.Vector3(0, 5.2, 10.5).applyQuaternion(this.car.root.quaternion);
    const targetCamera = this.car.root.position.clone().add(cameraOffset);
    this.world.camera.position.lerp(targetCamera, 1 - Math.exp(-4 * dt));
    this.world.camera.lookAt(this.car.root.position.x, this.car.root.position.y + 0.7, this.car.root.position.z);
    this.view.render(this.world.scene, this.world.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  dispose(): void {
    this.stop();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.world.dispose(); this.view.dispose();
  }
}