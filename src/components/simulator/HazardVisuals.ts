import * as THREE from "three";

export class HazardVisuals {
  public group: THREE.Group;
  public gasCloudMesh: THREE.Mesh;
  public gasParticles: THREE.Points;
  public fractureMesh: THREE.Mesh;
  public hazardWarningLight: THREE.PointLight;

  private gasMat: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();

    // 1. Methane Gas Pocket (CH4 2.4% LEL) Volumetric Cloud in Tunnel B-04
    const gasGeom = new THREE.SphereGeometry(4.2, 16, 16);
    this.gasMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Amber gas haze
      transparent: true,
      opacity: 0.0,
      wireframe: true,
    });
    this.gasCloudMesh = new THREE.Mesh(gasGeom, this.gasMat);
    this.gasCloudMesh.position.set(13, 1.8, -6.5);
    this.group.add(this.gasCloudMesh);

    // Hazard Gas Particles
    const particleCount = 120;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = 13 + (Math.random() - 0.5) * 6;
      pPos[i + 1] = 0.5 + Math.random() * 3.0;
      pPos[i + 2] = -6.5 + (Math.random() - 0.5) * 6;
    }
    pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.18,
      transparent: true,
      opacity: 0.0,
    });
    this.gasParticles = new THREE.Points(pGeom, pMat);
    this.group.add(this.gasParticles);

    // 2. Strata Fracture / Roof Delamination Fissure (Red jagged geometry on ceiling)
    const crackGeom = new THREE.BoxGeometry(4.0, 0.25, 0.4);
    const crackMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Bright red fracture line
      wireframe: true,
    });
    this.fractureMesh = new THREE.Mesh(crackGeom, crackMat);
    this.fractureMesh.position.set(15, 3.7, -6.5);
    this.fractureMesh.rotation.y = -Math.PI / 12;
    this.fractureMesh.visible = false;
    this.group.add(this.fractureMesh);

    // Hazard Area Warning Light
    this.hazardWarningLight = new THREE.PointLight(0xf59e0b, 0, 15);
    this.hazardWarningLight.position.set(13, 2.5, -6.5);
    this.group.add(this.hazardWarningLight);
  }

  public update(deltaSec: number, hazardActive: boolean) {
    if (hazardActive) {
      const pulse = 0.25 + Math.sin(Date.now() / 300) * 0.12;
      this.gasMat.opacity = pulse;
      (this.gasParticles.material as THREE.PointsMaterial).opacity = pulse * 1.8;
      this.gasCloudMesh.rotation.y += deltaSec * 0.2;
      this.fractureMesh.visible = true;
      this.hazardWarningLight.intensity = 1.8 + Math.sin(Date.now() / 200) * 0.8;
    } else {
      this.gasMat.opacity = 0.0;
      (this.gasParticles.material as THREE.PointsMaterial).opacity = 0.0;
      this.fractureMesh.visible = false;
      this.hazardWarningLight.intensity = 0.0;
    }
  }
}
