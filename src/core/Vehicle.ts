import * as THREE from "three";

export class PlayerCar {
  readonly root = new THREE.Group();
  private readonly wheels: THREE.Group[] = [];
  private readonly frontWheels: THREE.Group[] = [];

  constructor() {
    const paint = new THREE.MeshStandardMaterial({ color: "#087fc7", metalness: 0.72, roughness: 0.24 });
    const dark = new THREE.MeshStandardMaterial({ color: "#101923", metalness: 0.25, roughness: 0.34 });
    const glass = new THREE.MeshStandardMaterial({ color: "#102c40", metalness: 0.45, roughness: 0.16 });
    const trim = new THREE.MeshStandardMaterial({ color: "#b8d7e8", metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.48, 4.25), paint);
    body.position.y = 0.72; body.castShadow = true; body.receiveShadow = true; this.root.add(body);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.18, 1.25), paint);
    hood.position.set(0, 0.99, -1.25); hood.castShadow = true; this.root.add(hood);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.72, 1.95), glass);
    cabin.position.set(0, 1.27, 0.05); cabin.castShadow = true; this.root.add(cabin);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.48), paint);
    roof.position.set(0, 1.68, 0.08); roof.castShadow = true; this.root.add(roof);
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.18, 0.2), dark);
    frontBumper.position.set(0, 0.48, -2.12); this.root.add(frontBumper);
    const rearBumper = frontBumper.clone(); rearBumper.position.z = 2.12; this.root.add(rearBumper);
    for (const x of [-0.72, 0.72]) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.035), trim);
      lamp.position.set(x, 0.82, -2.14); this.root.add(lamp);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.035), new THREE.MeshStandardMaterial({ color: "#ef334d", emissive: "#8d0718" }));
      tail.position.set(x, 0.82, 2.14); this.root.add(tail);
    }
    for (const x of [-1.02, 1.02]) for (const z of [-1.38, 1.38]) {
      const pivot = new THREE.Group(); pivot.position.set(x, 0.48, z); this.root.add(pivot);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.25, 20), dark);
      tire.rotation.z = Math.PI / 2; tire.castShadow = true; pivot.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.26, 16), trim);
      rim.rotation.z = Math.PI / 2; pivot.add(rim);
      this.wheels.push(pivot);
      if (z < 0) this.frontWheels.push(pivot);
    }
  }

  updateWheels(distance: number, steering: number): void {
    for (const wheel of this.wheels) wheel.rotation.x -= distance / 0.43;
    for (const wheel of this.frontWheels) wheel.rotation.y = steering * 0.42;
  }
}