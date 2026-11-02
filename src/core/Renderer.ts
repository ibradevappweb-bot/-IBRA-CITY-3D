import * as THREE from "three";
import {
  GRAPHICS_PROFILES,
  type GraphicsQuality,
} from "./GraphicsSettings";

export class GameRenderer {
  readonly renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement, quality: GraphicsQuality) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: GRAPHICS_PROFILES[quality].antialias,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.applyQuality(quality);
  }

  applyQuality(quality: GraphicsQuality): void {
    const profile = GRAPHICS_PROFILES[quality];
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, profile.pixelRatioCap),
    );
    this.renderer.toneMappingExposure = profile.toneMappingExposure;
    this.renderer.shadowMap.enabled = profile.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.resize();
  }

  resize(): void {
    const canvas = this.renderer.domElement;
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    this.renderer.setSize(width, height, false);
  }

  render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera);
  }

  dispose(): void {
    this.renderer.dispose();
  }
}
