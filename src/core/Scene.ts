import * as THREE from "three";

export class GameScene {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  private readonly resizeObserver: ResizeObserver;

  constructor(private readonly container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#a9bfd2");
    this.scene.fog = new THREE.Fog("#a9bfd2", 24, 90);

    this.camera = new THREE.PerspectiveCamera(
      55,
      this.getAspectRatio(),
      0.1,
      180,
    );
    this.camera.position.set(11, 9, 14);
    this.camera.lookAt(0, 0, 0);

    this.createEnvironment();

    this.resizeObserver = new ResizeObserver(() => this.resizeCamera());
    this.resizeObserver.observe(container);
    this.resizeCamera();
  }

  private createEnvironment(): void {
    const hemisphere = new THREE.HemisphereLight("#e5f2ff", "#536477", 2.1);
    this.scene.add(hemisphere);

    const sun = new THREE.DirectionalLight("#fff0d7", 2.6);
    sun.position.set(-8, 15, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    this.scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({
        color: "#263747",
        roughness: 0.92,
        metalness: 0.04,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.04;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const grid = new THREE.GridHelper(100, 50, "#52718b", "#354c60");
    grid.position.y = 0.015;
    this.scene.add(grid);

    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.35, 5),
      new THREE.MeshStandardMaterial({
        color: "#15283a",
        metalness: 0.35,
        roughness: 0.55,
      }),
    );
    platform.position.set(0, 0.18, 0);
    platform.castShadow = true;
    platform.receiveShadow = true;
    this.scene.add(platform);

    const marker = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.035, 8, 96),
      new THREE.MeshBasicMaterial({ color: "#269cff" }),
    );
    marker.rotation.x = Math.PI / 2;
    marker.position.y = 0.025;
    this.scene.add(marker);

    const skyline = new THREE.Group();
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: "#536b80",
      roughness: 0.8,
      metalness: 0.12,
    });
    const buildingSpecs = [
      [-18, 2.5, -13, 5, 8, 5],
      [-11, 4, -20, 6, 11, 7],
      [15, 3, -17, 7, 9, 6],
      [21, 5, -7, 5, 13, 5],
      [-20, 3.5, 13, 6, 10, 7],
      [18, 3, 14, 7, 8, 6],
    ];

    for (const [x, width, z, depth, height, unused] of buildingSpecs) {
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        buildingMaterial,
      );
      building.position.set(x, height / 2 - 0.02, z);
      building.castShadow = true;
      building.receiveShadow = true;
      skyline.add(building);
      void unused;
    }
    this.scene.add(skyline);
  }

  private getAspectRatio(): number {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    return width / height;
  }

  private resizeCamera(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.resizeObserver.disconnect();
  }
}
