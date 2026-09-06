import * as THREE from "three";

export class SignalPulses {
  public group: THREE.Group;
  private rings: THREE.Mesh[] = [];
  private ringMaterials: THREE.MeshBasicMaterial[] = [];

  constructor() {
    this.group = new THREE.Group();

    // Create 4 concentric expanding signal rings
    for (let i = 0; i < 4; i++) {
      const geom = new THREE.RingGeometry(0.5, 0.7, 32);
      geom.rotateX(-Math.PI / 2); // Horizontal ring

      const mat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8, // Cyan signal wave
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
      });

      const ring = new THREE.Mesh(geom, mat);
      ring.position.y = 2.0;
      this.rings.push(ring);
      this.ringMaterials.push(mat);
      this.group.add(ring);
    }
  }

  public update(deltaSec: number, roverPos: THREE.Vector3, isActive: boolean) {
    if (isActive) {
      this.rings.forEach((ring, idx) => {
        const timeOffset = (Date.now() / 600 + idx * 0.25) % 1;
        const scale = 1.0 + timeOffset * 18.0;
        ring.scale.set(scale, scale, scale);
        ring.position.set(roverPos.x - timeOffset * 25, 2.0, roverPos.z * (1 - timeOffset));
        this.ringMaterials[idx].opacity = (1.0 - timeOffset) * 0.75;
      });
    } else {
      this.ringMaterials.forEach((mat) => {
        mat.opacity = 0.0;
      });
    }
  }
}
