import * as THREE from "three";

export class Rover3DModel {
  public group: THREE.Group;
  public wheels: THREE.Mesh[] = [];
  public lidarDome: THREE.Group;
  public headlightLeft: THREE.SpotLight;
  public headlightRight: THREE.SpotLight;
  public headlightTargetLeft: THREE.Object3D;
  public headlightTargetRight: THREE.Object3D;
  public statusLed: THREE.Mesh;
  public scanCone: THREE.Mesh;
  public antennaTip: THREE.Mesh;

  private statusLedMaterial: THREE.MeshStandardMaterial;
  private scanConeMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();

    // 1. Rugged Chassis Frame (Industrial Matte Charcoal)
    const bodyGeometry = new THREE.BoxGeometry(2.4, 0.7, 1.4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // slate-800
      metalness: 0.85,
      roughness: 0.35,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.65;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.group.add(bodyMesh);

    // Armor plating & Orange industrial accent stripe
    const armorPlateGeom = new THREE.BoxGeometry(2.0, 0.15, 1.45);
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf97316, // industrial safety orange
      metalness: 0.5,
      roughness: 0.4,
    });
    const armorPlate = new THREE.Mesh(armorPlateGeom, accentMaterial);
    armorPlate.position.set(0, 0.95, 0);
    this.group.add(armorPlate);

    // Front Bumper / Bull-Bar (Black steel)
    const bumperGeom = new THREE.BoxGeometry(0.3, 0.4, 1.6);
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const bumper = new THREE.Mesh(bumperGeom, bumperMat);
    bumper.position.set(1.3, 0.5, 0);
    this.group.add(bumper);

    // Rear Bumper
    const rearBumper = bumper.clone();
    rearBumper.position.set(-1.3, 0.5, 0);
    this.group.add(rearBumper);

    // 2. Rugged 4x4 Off-Road Knobby Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.45, 20);
    wheelGeom.rotateX(Math.PI / 2); // Rotate to roll forward
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Dark rubber
      roughness: 0.9,
      metalness: 0.1,
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Slate rim
      metalness: 0.8,
      roughness: 0.2,
    });

    const wheelPositions = [
      { x: 0.85, y: 0.48, z: 0.95 },
      { x: 0.85, y: 0.48, z: -0.95 },
      { x: -0.85, y: 0.48, z: 0.95 },
      { x: -0.85, y: 0.48, z: -0.95 },
    ];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(wheelGeom, wheelMat);
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Hubcap Rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.48, 12), rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      this.wheels.push(tire);
      this.group.add(wheelGroup);
    });

    // 3. Sensor Mast & Spinning LiDAR Dome
    this.lidarDome = new THREE.Group();
    this.lidarDome.position.set(0.2, 1.25, 0);

    const mastGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 12);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
    const mast = new THREE.Mesh(mastGeom, mastMat);
    mast.position.y = -0.15;
    this.lidarDome.add(mast);

    const domeGeom = new THREE.CylinderGeometry(0.22, 0.25, 0.22, 16);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Cyan blue LiDAR housing
      metalness: 0.8,
      roughness: 0.2,
    });
    const dome = new THREE.Mesh(domeGeom, domeMat);
    this.lidarDome.add(dome);

    // Laser emitter ring
    const laserRingGeom = new THREE.TorusGeometry(0.23, 0.03, 8, 24);
    laserRingGeom.rotateX(Math.PI / 2);
    const laserRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const laserRing = new THREE.Mesh(laserRingGeom, laserRingMat);
    this.lidarDome.add(laserRing);

    this.group.add(this.lidarDome);

    // 4. Front Optical + FLIR Thermal Camera Housing
    const camHousingGeom = new THREE.BoxGeometry(0.35, 0.28, 0.55);
    const camMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const camHousing = new THREE.Mesh(camHousingGeom, camMat);
    camHousing.position.set(1.2, 0.9, 0);
    this.group.add(camHousing);

    // Optical Lens
    const lensGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.08, 12);
    lensGeom.rotateZ(Math.PI / 2);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Cyan camera lens
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.set(1.36, 0.94, 0.14);
    this.group.add(lens);

    // Thermal FLIR Lens
    const thermalLensMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e }); // Rose red thermal lens
    const thermalLens = new THREE.Mesh(lensGeom, thermalLensMat);
    thermalLens.position.set(1.36, 0.94, -0.14);
    this.group.add(thermalLens);

    // 5. Dual High-Intensity Headlights (Real SpotLights)
    this.headlightTargetLeft = new THREE.Object3D();
    this.headlightTargetLeft.position.set(15, 0.2, 1.5);
    this.group.add(this.headlightTargetLeft);

    this.headlightTargetRight = new THREE.Object3D();
    this.headlightTargetRight.position.set(15, 0.2, -1.5);
    this.group.add(this.headlightTargetRight);

    this.headlightLeft = new THREE.SpotLight(0xfffbeb, 4.5, 30, Math.PI / 5, 0.35, 1.2);
    this.headlightLeft.position.set(1.3, 0.65, 0.5);
    this.headlightLeft.target = this.headlightTargetLeft;
    this.headlightLeft.castShadow = true;
    this.group.add(this.headlightLeft);

    this.headlightRight = new THREE.SpotLight(0xfffbeb, 4.5, 30, Math.PI / 5, 0.35, 1.2);
    this.headlightRight.position.set(1.3, 0.65, -0.5);
    this.headlightRight.target = this.headlightTargetRight;
    this.headlightRight.castShadow = true;
    this.group.add(this.headlightRight);

    // Headlight emitter bulbs (Glowing meshes)
    const bulbGeom = new THREE.SphereGeometry(0.09, 12, 12);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bulbL = new THREE.Mesh(bulbGeom, bulbMat);
    bulbL.position.set(1.3, 0.65, 0.5);
    this.group.add(bulbL);
    const bulbR = new THREE.Mesh(bulbGeom, bulbMat);
    bulbR.position.set(1.3, 0.65, -0.5);
    this.group.add(bulbR);

    // 6. Wireless Telemetry Antenna with Glowing Tip
    const antennaRodGeom = new THREE.CylinderGeometry(0.02, 0.03, 1.1, 8);
    const antennaRodMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
    const antennaRod = new THREE.Mesh(antennaRodGeom, antennaRodMat);
    antennaRod.position.set(-0.9, 1.45, 0.5);
    this.group.add(antennaRod);

    const tipGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Emerald transmission pulse
    this.antennaTip = new THREE.Mesh(tipGeom, tipMat);
    this.antennaTip.position.set(-0.9, 2.0, 0.5);
    this.group.add(this.antennaTip);

    // 7. Status Multi-color LED on chassis
    const ledGeom = new THREE.SphereGeometry(0.08, 12, 12);
    this.statusLedMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald green initially
      emissive: 0x10b981,
      emissiveIntensity: 1.5,
    });
    this.statusLed = new THREE.Mesh(ledGeom, this.statusLedMaterial);
    this.statusLed.position.set(-0.6, 1.05, -0.45);
    this.group.add(this.statusLed);

    // 8. Front Holographic Scanning Cone (Volumetric Holographic Beam)
    const coneGeom = new THREE.ConeGeometry(4.5, 12, 24, 1, true);
    coneGeom.rotateX(-Math.PI / 2); // Point forward
    coneGeom.translate(0, 0, 6);
    this.scanConeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0, // hidden initially
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.scanCone = new THREE.Mesh(coneGeom, this.scanConeMaterial);
    this.scanCone.position.set(1.3, 0.9, 0);
    this.group.add(this.scanCone);
  }

  public update(deltaSec: number, speed: number, isScanning: boolean, hazardState: 'SAFE' | 'WARNING' | 'CRITICAL') {
    // 1. Rotate wheels proportional to movement speed
    const wheelRot = speed * deltaSec * 3.5;
    this.wheels.forEach((w) => {
      w.rotation.x += wheelRot;
    });

    // 2. Spin LiDAR sensor continuously
    if (this.lidarDome) {
      this.lidarDome.rotation.y += deltaSec * 8.0;
    }

    // 3. Status LED color reaction
    if (hazardState === 'CRITICAL') {
      this.statusLedMaterial.color.setHex(0xef4444);
      this.statusLedMaterial.emissive.setHex(0xef4444);
    } else if (hazardState === 'WARNING') {
      this.statusLedMaterial.color.setHex(0xf59e0b);
      this.statusLedMaterial.emissive.setHex(0xf59e0b);
    } else {
      this.statusLedMaterial.color.setHex(0x10b981);
      this.statusLedMaterial.emissive.setHex(0x10b981);
    }

    // 4. Scanning Cone animation during DETECT phase
    if (isScanning) {
      this.scanConeMaterial.opacity = 0.25 + Math.sin(Date.now() / 150) * 0.15;
      this.scanCone.rotation.z = Math.sin(Date.now() / 400) * 0.2;
    } else {
      this.scanConeMaterial.opacity = 0.0;
    }
  }
}
