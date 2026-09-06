import * as THREE from "three";

export class Rover3DModel {
  public group: THREE.Group;
  public wheels: THREE.Mesh[] = [];
  public lidarDome: THREE.Group;
  public headlightLeft: THREE.SpotLight;
  public headlightRight: THREE.SpotLight;
  public headlightTargetLeft: THREE.Object3D;
  public headlightTargetRight: THREE.Object3D;
  public roverBodyLight: THREE.PointLight;
  public statusLed: THREE.Mesh;
  public scanCone: THREE.Mesh;
  public antennaTip: THREE.Mesh;

  private statusLedMaterial: THREE.MeshStandardMaterial;
  private scanConeMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.group = new THREE.Group();

    // 1. Rugged Chassis Frame (High-Contrast Industrial Matte Charcoal + Safety Orange)
    const bodyGeometry = new THREE.BoxGeometry(2.5, 0.75, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Slate-800
      metalness: 0.85,
      roughness: 0.35,
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.7;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.group.add(bodyMesh);

    // Industrial Safety Orange Armor Plating Top
    const armorPlateGeom = new THREE.BoxGeometry(2.1, 0.18, 1.55);
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Vibrant safety orange
      metalness: 0.5,
      roughness: 0.3,
    });
    const armorPlate = new THREE.Mesh(armorPlateGeom, accentMaterial);
    armorPlate.position.set(0, 1.05, 0);
    this.group.add(armorPlate);

    // Front Heavy-Duty Bull-Bar Bumper (Black Steel)
    const bumperGeom = new THREE.BoxGeometry(0.35, 0.45, 1.7);
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const bumper = new THREE.Mesh(bumperGeom, bumperMat);
    bumper.position.set(1.35, 0.55, 0);
    this.group.add(bumper);

    // Rear Bumper
    const rearBumper = bumper.clone();
    rearBumper.position.set(-1.35, 0.55, 0);
    this.group.add(rearBumper);

    // 2. Rugged 4x4 Off-Road Knobby Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.48, 20);
    wheelGeom.rotateX(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Bright steel hub
      metalness: 0.85,
      roughness: 0.2,
    });

    const wheelPositions = [
      { x: 0.88, y: 0.5, z: 1.0 },
      { x: 0.88, y: 0.5, z: -1.0 },
      { x: -0.88, y: 0.5, z: 1.0 },
      { x: -0.88, y: 0.5, z: -1.0 },
    ];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(wheelGeom, wheelMat);
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Steel Hubcap
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.5, 12), rimMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      this.wheels.push(tire);
      this.group.add(wheelGroup);
    });

    // 3. Sensor Mast & Spinning LiDAR Dome
    this.lidarDome = new THREE.Group();
    this.lidarDome.position.set(0.2, 1.4, 0);

    const mastGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.45, 12);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const mast = new THREE.Mesh(mastGeom, mastMat);
    mast.position.y = -0.18;
    this.lidarDome.add(mast);

    const domeGeom = new THREE.CylinderGeometry(0.24, 0.28, 0.25, 16);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Cyan blue LiDAR housing
      metalness: 0.85,
      roughness: 0.2,
    });
    const dome = new THREE.Mesh(domeGeom, domeMat);
    this.lidarDome.add(dome);

    // Laser Emitter Ring (Glowing Cyan)
    const laserRingGeom = new THREE.TorusGeometry(0.26, 0.03, 8, 24);
    laserRingGeom.rotateX(Math.PI / 2);
    const laserRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const laserRing = new THREE.Mesh(laserRingGeom, laserRingMat);
    this.lidarDome.add(laserRing);

    this.group.add(this.lidarDome);

    // 4. Front Optical + FLIR Thermal Camera Turret
    const camHousingGeom = new THREE.BoxGeometry(0.38, 0.32, 0.6);
    const camMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const camHousing = new THREE.Mesh(camHousingGeom, camMat);
    camHousing.position.set(1.28, 1.0, 0);
    this.group.add(camHousing);

    // Optical Lens
    const lensGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.09, 12);
    lensGeom.rotateZ(Math.PI / 2);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.set(1.46, 1.05, 0.16);
    this.group.add(lens);

    // Thermal FLIR Lens
    const thermalLensMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const thermalLens = new THREE.Mesh(lensGeom, thermalLensMat);
    thermalLens.position.set(1.46, 1.05, -0.16);
    this.group.add(thermalLens);

    // 5. Dual High-Intensity Headlights (Real SpotLights)
    this.headlightTargetLeft = new THREE.Object3D();
    this.headlightTargetLeft.position.set(18, 0.2, 1.5);
    this.group.add(this.headlightTargetLeft);

    this.headlightTargetRight = new THREE.Object3D();
    this.headlightTargetRight.position.set(18, 0.2, -1.5);
    this.group.add(this.headlightTargetRight);

    // Strong Spotlights illuminating the tunnel ahead
    this.headlightLeft = new THREE.SpotLight(0xfffbeb, 7.5, 45, Math.PI / 4.5, 0.4, 1.1);
    this.headlightLeft.position.set(1.4, 0.75, 0.55);
    this.headlightLeft.target = this.headlightTargetLeft;
    this.headlightLeft.castShadow = true;
    this.group.add(this.headlightLeft);

    this.headlightRight = new THREE.SpotLight(0xfffbeb, 7.5, 45, Math.PI / 4.5, 0.4, 1.1);
    this.headlightRight.position.set(1.4, 0.75, -0.55);
    this.headlightRight.target = this.headlightTargetRight;
    this.headlightRight.castShadow = true;
    this.group.add(this.headlightRight);

    // Headlight emitter bulbs (Glowing meshes)
    const bulbGeom = new THREE.SphereGeometry(0.1, 12, 12);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bulbL = new THREE.Mesh(bulbGeom, bulbMat);
    bulbL.position.set(1.4, 0.75, 0.55);
    this.group.add(bulbL);
    const bulbR = new THREE.Mesh(bulbGeom, bulbMat);
    bulbR.position.set(1.4, 0.75, -0.55);
    this.group.add(bulbR);

    // Forward PointLight Fill for nearby ground visibility
    const fwdFill = new THREE.PointLight(0xffedd5, 3.2, 18, 1.4);
    fwdFill.position.set(2.2, 0.9, 0);
    this.group.add(fwdFill);

    // Hero Rover Chassis Glow Light (Ensures rover is always clearly visible)
    this.roverBodyLight = new THREE.PointLight(0x93c5fd, 2.0, 10, 1.6);
    this.roverBodyLight.position.set(0, 1.8, 0);
    this.group.add(this.roverBodyLight);

    // 6. Wireless Telemetry Antenna with Glowing Tip
    const antennaRodGeom = new THREE.CylinderGeometry(0.02, 0.03, 1.2, 8);
    const antennaRodMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
    const antennaRod = new THREE.Mesh(antennaRodGeom, antennaRodMat);
    antennaRod.position.set(-1.0, 1.6, 0.55);
    this.group.add(antennaRod);

    const tipGeom = new THREE.SphereGeometry(0.09, 12, 12);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    this.antennaTip = new THREE.Mesh(tipGeom, tipMat);
    this.antennaTip.position.set(-1.0, 2.2, 0.55);
    this.group.add(this.antennaTip);

    // 7. Status Multi-color LED
    const ledGeom = new THREE.SphereGeometry(0.09, 12, 12);
    this.statusLedMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.8,
    });
    this.statusLed = new THREE.Mesh(ledGeom, this.statusLedMaterial);
    this.statusLed.position.set(-0.7, 1.15, -0.5);
    this.group.add(this.statusLed);

    // 8. Front Holographic Scanning Cone (Volumetric Beam for DETECT phase)
    const coneGeom = new THREE.ConeGeometry(5.0, 14, 24, 1, true);
    coneGeom.rotateX(-Math.PI / 2);
    coneGeom.translate(0, 0, 7);
    this.scanConeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.scanCone = new THREE.Mesh(coneGeom, this.scanConeMaterial);
    this.scanCone.position.set(1.4, 1.0, 0);
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
      this.scanConeMaterial.opacity = 0.28 + Math.sin(Date.now() / 150) * 0.15;
      this.scanCone.rotation.z = Math.sin(Date.now() / 400) * 0.2;
    } else {
      this.scanConeMaterial.opacity = 0.0;
    }
  }
}
