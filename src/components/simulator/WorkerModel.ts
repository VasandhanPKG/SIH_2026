import * as THREE from "three";

export class Worker3DModel {
  public group: THREE.Group;
  public thermalAura: THREE.Mesh;
  public headlamp: THREE.SpotLight;
  private auraMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(28, 0, -7.8);
    this.group.rotation.y = -Math.PI / 2; // Facing towards tunnel entrance

    // 1. Worker Body (Seated / Resting posture inside Refuge Chamber)
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0xea580c, // High-vis orange mining coverall
      roughness: 0.8,
    });
    const vestMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Reflective yellow vest
      roughness: 0.4,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.7,
    });
    const bootMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Black work boots
      roughness: 0.5,
    });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.35), suitMat);
    torso.position.set(0, 0.75, 0);
    torso.castShadow = true;
    this.group.add(torso);

    // Reflective Safety Vest
    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.45, 0.37), vestMat);
    vest.position.set(0, 0.75, 0);
    this.group.add(vest);

    // Seated Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.65), suitMat);
    legL.position.set(-0.16, 0.25, 0.3);
    legL.castShadow = true;
    this.group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.65), suitMat);
    legR.position.set(0.16, 0.25, 0.3);
    legR.castShadow = true;
    this.group.add(legR);

    // Boots
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.25), bootMat);
    bootL.position.set(-0.16, 0.22, 0.65);
    this.group.add(bootL);

    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.25), bootMat);
    bootR.position.set(0.16, 0.22, 0.65);
    this.group.add(bootR);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), skinMat);
    head.position.set(0, 1.25, 0);
    this.group.add(head);

    // Mining Hardhat (Yellow)
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.2 });
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), helmetMat);
    helmet.position.set(0, 1.3, 0);
    this.group.add(helmet);

    // Headlamp fixture & spot light
    const lampFixtureMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lampFixture = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), lampFixtureMat);
    lampFixture.position.set(0, 1.36, 0.2);
    this.group.add(lampFixture);

    const lampTarget = new THREE.Object3D();
    lampTarget.position.set(0, 0.2, 6);
    this.group.add(lampTarget);

    this.headlamp = new THREE.SpotLight(0xfef08a, 2.0, 12, Math.PI / 6, 0.4);
    this.headlamp.position.set(0, 1.36, 0.22);
    this.headlamp.target = lampTarget;
    this.group.add(this.headlamp);

    // 2. Pulsing FLIR Thermal Heat Signature Aura (Sphere)
    const auraGeom = new THREE.SphereGeometry(1.2, 16, 16);
    this.auraMaterial = new THREE.MeshBasicMaterial({
      color: 0xf43f5e, // Rose red / thermal signature
      transparent: true,
      opacity: 0.0, // Activated during DETECT
      wireframe: true,
    });
    this.thermalAura = new THREE.Mesh(auraGeom, this.auraMaterial);
    this.thermalAura.position.set(0, 0.8, 0);
    this.group.add(this.thermalAura);
  }

  public update(isDetected: boolean) {
    if (isDetected) {
      // Pulse thermal heat signature aura
      const pulse = 0.35 + Math.sin(Date.now() / 250) * 0.2;
      this.auraMaterial.opacity = pulse;
      this.thermalAura.rotation.y += 0.02;
    } else {
      this.auraMaterial.opacity = 0.0;
    }
  }
}
