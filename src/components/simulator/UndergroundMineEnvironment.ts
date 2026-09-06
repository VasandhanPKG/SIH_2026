import * as THREE from "three";

/**
 * UndergroundMineEnvironment
 * Professional, high-visibility 3D underground coal/metal mine digital twin:
 * - High-contrast readable rock cavern walls and vaulted arches
 * - Base Station command hub with charging terminal, battery racks, crates & comms
 * - Navigable tunnel network: Main Haulage, Junction Alpha, Hazard Tunnel B-04, South Incline Bypass, Refuge Chamber 7B
 * - Steel rail tracks with wooden railway ties along the floor
 * - Repeating mining timber sets (legs, collars, steel gussets, horizontal lagging)
 * - Overhead flexible yellow ventilation ducts & wall cable trays
 * - Industrial caged halogen mining lamps casting visible warm light pools
 * - Mine carts, barrels, oxygen tanks, tool chests, and safety signs
 * - Collapsed rockfall debris & ceiling fracture zone
 * - Atmospheric dust particulates
 */
export class UndergroundMineEnvironment {
  public group: THREE.Group;
  public dustParticles: THREE.Points;
  public tunnelLights: THREE.PointLight[] = [];

  constructor() {
    this.group = new THREE.Group();

    // 1. Mine Cavern Floor (Readable high-contrast gravel shale)
    this.buildMineFloor();

    // 2. Continuous Rocky Cavern Walls & Arched Ceilings
    this.buildRockTunnelCaverns();

    // 3. Base Station Command Area (x: -35 to -28)
    this.buildBaseStation();

    // 4. Steel Rail Tracks & Wooden Sleepers
    this.buildMineRailTracks();

    // 5. Heavy Mining Timber Sets & Steel Arches
    this.buildTimberSupportStructures();

    // 6. Overhead Flexible Ventilation Ducts (Yellow/Orange)
    this.buildVentilationDucts();

    // 7. Wall Cable Trays, Power Conduits & High-Pressure Pipes
    this.buildWallUtilities();

    // 8. Industrial Mining Props (Minecart, Crates, Barrels, O2 Tanks, Toolboxes)
    this.buildMiningProps();

    // 9. Hanging Industrial Caged Halogen Lamps
    this.buildCagedLamps();

    // 10. Mining Safety Signage & Direction Boards
    this.buildSafetySignage();

    // 11. Collapsed Rockfall & Rubble Piles in Tunnel B-04
    this.buildRockfallAndDebris();

    // 12. Refuge Chamber 7B with Steel Blast Door (x: 29, z: -8)
    this.buildRefugeChamber();

    // 13. Atmospheric Dust Particles
    this.dustParticles = this.buildDustParticles();
    this.group.add(this.dustParticles);
  }

  private buildMineFloor() {
    const floorGeom = new THREE.PlaneGeometry(120, 80, 48, 48);
    floorGeom.rotateX(-Math.PI / 2);

    const pos = floorGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distFromCenter = Math.abs(z);
      if (distFromCenter > 3.0) {
        const noise = (Math.sin(x * 0.3) * Math.cos(z * 0.3)) * 0.35;
        pos.setY(i, Math.max(0, noise));
      } else {
        pos.setY(i, Math.sin(x * 1.8) * 0.03);
      }
    }
    floorGeom.computeVertexNormals();

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x242e3f, // Readable slate-charcoal gravel floor (high contrast)
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.receiveShadow = true;
    this.group.add(floor);
  }

  private buildRockTunnelCaverns() {
    // High-contrast readable rock material (Slate Grey with warm cavity tones)
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Slate-800 readable rock
      roughness: 0.85,
      metalness: 0.2,
      flatShading: true,
    });

    const innerWallMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Slate-700 illuminated rock facets
      roughness: 0.8,
      metalness: 0.15,
      flatShading: true,
    });

    const createRockWall = (x: number, y: number, z: number, w: number, h: number, d: number, rotY = 0) => {
      const wallGeom = new THREE.BoxGeometry(w, h, d, 10, 6, 6);
      const p = wallGeom.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setX(i, p.getX(i) + (Math.sin(i * 1.4) * 0.28));
        p.setY(i, p.getY(i) + (Math.cos(i * 1.6) * 0.18));
        p.setZ(i, p.getZ(i) + (Math.sin(i * 2.2) * 0.28));
      }
      wallGeom.computeVertexNormals();
      const wall = new THREE.Mesh(wallGeom, rockMat);
      wall.position.set(x, y, z);
      wall.rotation.y = rotY;
      wall.receiveShadow = true;
      wall.castShadow = true;
      this.group.add(wall);
    };

    // Tunnel A North Rock Wall (z = -4.2)
    createRockWall(-16, 2.6, -4.4, 36, 5.2, 1.8);
    // Tunnel A South Rock Wall (z = 4.2)
    createRockWall(-16, 2.6, 4.4, 36, 5.2, 1.8);

    // Hazard Tunnel B-04 North Wall (Angled North-East)
    createRockWall(16, 2.6, -13.0, 32, 5.2, 1.8, -Math.PI / 10);
    createRockWall(12, 2.6, -2.8, 22, 5.2, 1.8, -Math.PI / 10);

    // South Incline Bypass South Wall (Angled South-East)
    createRockWall(16, 2.6, 13.0, 32, 5.2, 1.8, Math.PI / 10);
    createRockWall(12, 2.6, 2.8, 22, 5.2, 1.8, Math.PI / 10);

    // Vaulted Arched Rock Ceilings (Visible vaulted cavern roof)
    const createVaultedRoof = (x: number, y: number, z: number, length: number, radius: number, rotY = 0) => {
      const roofGeom = new THREE.CylinderGeometry(radius, radius, length, 16, 4, true, 0, Math.PI);
      roofGeom.rotateZ(Math.PI / 2);
      roofGeom.rotateY(Math.PI / 2);

      const p = roofGeom.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setY(i, p.getY(i) + (Math.sin(i * 2.0) * 0.15));
      }
      roofGeom.computeVertexNormals();

      const roof = new THREE.Mesh(roofGeom, innerWallMat);
      roof.position.set(x, y, z);
      roof.rotation.y = rotY;
      this.group.add(roof);
    };

    createVaultedRoof(-16, 2.6, 0, 36, 4.6);
    createVaultedRoof(14, 2.6, -7.0, 30, 4.6, -Math.PI / 10);
    createVaultedRoof(14, 2.6, 7.0, 30, 4.6, Math.PI / 10);
  }

  private buildBaseStation() {
    const baseGroup = new THREE.Group();
    baseGroup.position.set(-32, 0, 0);

    // Concrete Base Platform with Yellow Hazard Border
    const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.25, 7.0), padMat);
    pad.position.set(0, 0.12, 0);
    pad.receiveShadow = true;
    baseGroup.add(pad);

    // Hazard Border Stripes on Pad
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const stripeL = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.28, 0.25), stripeMat);
    stripeL.position.set(0, 0.14, 3.4);
    baseGroup.add(stripeL);

    const stripeR = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.28, 0.25), stripeMat);
    stripeR.position.set(0, 0.14, -3.4);
    baseGroup.add(stripeR);

    // Rover Charging Dock Terminal (High-Tech Engineering Unit)
    const chargerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 });
    const charger = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.8), chargerMat);
    charger.position.set(-3.2, 1.2, -2.2);
    charger.castShadow = true;
    baseGroup.add(charger);

    // Glowing Terminal Screen (Cyan)
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), screenMat);
    screen.position.set(-2.58, 1.6, -2.2);
    screen.rotation.y = Math.PI / 2;
    baseGroup.add(screen);

    // Power Generator / Battery Pack Module
    const genMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }); // Safety Orange
    const generator = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 1.2), genMat);
    generator.position.set(-3.0, 0.7, 2.2);
    generator.castShadow = true;
    baseGroup.add(generator);

    // Concrete Shaft Portal Entrance Frame (-36m)
    const portalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.6 });
    const archFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.6, 8.2), portalMat);
    archFrame.position.set(-4.0, 2.8, 0);
    baseGroup.add(archFrame);

    // Base Station Header Sign
    const signMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 }); // Blue C2 Header
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 5.4), signMat);
    sign.position.set(-3.0, 5.0, 0);
    baseGroup.add(sign);

    // Mesh Relay Antenna Mast
    const towerGeom = new THREE.CylinderGeometry(0.12, 0.2, 7.8, 8);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.set(-3.2, 3.9, 3.2);
    baseGroup.add(tower);

    // Pulsing Base Station Blue Beacon
    const beaconGeom = new THREE.SphereGeometry(0.25, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(-3.2, 7.8, 3.2);
    baseGroup.add(beacon);

    // Base Station Warm Floodlight
    const baseLight = new THREE.PointLight(0x93c5fd, 2.4, 25, 1.5);
    baseLight.position.set(-1.0, 4.5, 0);
    baseLight.castShadow = true;
    baseGroup.add(baseLight);
    this.tunnelLights.push(baseLight);

    this.group.add(baseGroup);
  }

  private buildMineRailTracks() {
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Bright steel rails (high visibility)
      metalness: 0.9,
      roughness: 0.25,
    });
    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x5c2b09, // Creosote treated wooden ties
      roughness: 0.9,
    });

    const railGroup = new THREE.Group();

    // 1. Wooden Ties along Main Haulage Way (x: -30 to 0)
    for (let x = -30; x <= 0; x += 1.3) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 2.2), tieMat);
      tie.position.set(x, 0.05, 0);
      tie.receiveShadow = true;
      railGroup.add(tie);
    }

    // Steel Rails Left & Right (Gauge = 1.4m)
    const railGeom = new THREE.BoxGeometry(30, 0.14, 0.09);
    const railL = new THREE.Mesh(railGeom, railMat);
    railL.position.set(-15, 0.14, 0.7);
    railL.castShadow = true;
    railGroup.add(railL);

    const railR = new THREE.Mesh(railGeom, railMat);
    railR.position.set(-15, 0.14, -0.7);
    railR.castShadow = true;
    railGroup.add(railR);

    // 2. Ties and rails branching along South Incline (Route B)
    for (let i = 0; i <= 22; i += 1.3) {
      const t = i / 22;
      const x = 0 + t * 24;
      const z = 0 + t * 7.5;
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 2.2), tieMat);
      tie.position.set(x, 0.05, z);
      tie.rotation.y = Math.PI / 10;
      railGroup.add(tie);
    }

    this.group.add(railGroup);
  }

  private buildTimberSupportStructures() {
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e, // Rich golden-brown timber sets (visible & warm)
      roughness: 0.8,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Steel structural brackets
      metalness: 0.8,
      roughness: 0.3,
    });
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x713f12,
      roughness: 0.9,
    });

    const setPositions = [
      { x: -28, z: 0, rotY: 0 },
      { x: -21, z: 0, rotY: 0 },
      { x: -14, z: 0, rotY: 0 },
      { x: -7, z: 0, rotY: 0 },
      { x: 0, z: 0, rotY: 0 },
      // Hazard Tunnel Sets
      { x: 7, z: -4.5, rotY: -Math.PI / 10 },
      { x: 15, z: -7.2, rotY: -Math.PI / 10 },
      { x: 23, z: -8.0, rotY: -Math.PI / 10 },
      // Safe South Incline Sets
      { x: 7, z: 4.5, rotY: Math.PI / 10 },
      { x: 15, z: 7.2, rotY: Math.PI / 10 },
      { x: 23, z: 5.0, rotY: 0 },
    ];

    setPositions.forEach((pos) => {
      const set = new THREE.Group();
      set.position.set(pos.x, 0, pos.z);
      set.rotation.y = pos.rotY;

      // Left Timber Post
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 4.4, 0.42), woodMat);
      postL.position.set(0, 2.2, -3.2);
      postL.castShadow = true;
      set.add(postL);

      // Right Timber Post
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 4.4, 0.42), woodMat);
      postR.position.set(0, 2.2, 3.2);
      postR.castShadow = true;
      set.add(postR);

      // Top Cross Collar / Crossbeam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.42, 6.8), woodMat);
      beam.position.set(0, 4.3, 0);
      beam.castShadow = true;
      set.add(beam);

      // Steel Corner Brackets
      const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), steelMat);
      bracketL.position.set(0, 4.2, -3.1);
      set.add(bracketL);

      const bracketR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), steelMat);
      bracketR.position.set(0, 4.2, 3.1);
      set.add(bracketR);

      // Horizontal Wall Lagging Boards
      const boardL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 6.4), boardMat);
      boardL.position.set(0, 1.8, -3.5);
      set.add(boardL);

      const boardR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 6.4), boardMat);
      boardR.position.set(0, 1.8, 3.5);
      set.add(boardR);

      this.group.add(set);
    });
  }

  private buildVentilationDucts() {
    // Overhead flexible yellow ventilation tube running along the roof
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Bright industrial safety yellow
      roughness: 0.5,
      metalness: 0.15,
    });

    const createDuct = (x: number, y: number, z: number, length: number, rotY = 0) => {
      const ductGeom = new THREE.CylinderGeometry(0.48, 0.48, length, 16);
      ductGeom.rotateZ(Math.PI / 2);
      const duct = new THREE.Mesh(ductGeom, ductMat);
      duct.position.set(x, y, z);
      duct.rotation.y = rotY;
      duct.castShadow = true;
      this.group.add(duct);
    };

    createDuct(-15, 3.9, -2.0, 32);
    createDuct(14, 3.9, 4.6, 26, Math.PI / 10);
  }

  private buildWallUtilities() {
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Steel water / compressed air pipe
      metalness: 0.85,
      roughness: 0.3,
    });
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Heavy black high-voltage power cable
      roughness: 0.9,
    });

    const createPipeRun = (x: number, y: number, z: number, length: number, rotY = 0) => {
      // Steel Pipe
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, length, 10), pipeMat);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(x, y, z);
      pipe.rotation.y = rotY;
      this.group.add(pipe);

      // Power Cable Bundle
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, length, 8), cableMat);
      cable.rotation.z = Math.PI / 2;
      cable.position.set(x, y - 0.22, z);
      cable.rotation.y = rotY;
      this.group.add(cable);
    };

    createPipeRun(-15, 1.8, -3.5, 32);
    createPipeRun(14, 1.8, -10.0, 26, -Math.PI / 10);
    createPipeRun(14, 1.8, 10.0, 26, Math.PI / 10);
  }

  private buildMiningProps() {
    // 1. Traditional Ore Minecart parked near junction (x = -8, z = 2.0)
    const cartGroup = new THREE.Group();
    cartGroup.position.set(-8, 0, 2.0);

    const tubMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.4 });
    const tub = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.2), tubMat);
    tub.position.y = 0.75;
    tub.castShadow = true;
    cartGroup.add(tub);

    // Minecart Wheels
    const cartWheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const wheelGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 12);
    wheelGeom.rotateX(Math.PI / 2);

    [-0.6, 0.6].forEach((wx) => {
      [-0.65, 0.65].forEach((wz) => {
        const w = new THREE.Mesh(wheelGeom, cartWheelMat);
        w.position.set(wx, 0.24, wz);
        cartGroup.add(w);
      });
    });
    this.group.add(cartGroup);

    // 2. Equipment Wooden Crates & Toolboxes
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.8 });
    const crate1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 1.0), crateMat);
    crate1.position.set(-18, 0.5, 2.8);
    crate1.castShadow = true;
    this.group.add(crate1);

    const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), crateMat);
    crate2.position.set(-17.2, 0.4, 2.9);
    crate2.castShadow = true;
    this.group.add(crate2);

    // 3. Fuel Barrels (Blue & Red)
    const barrelMatBlue = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.1, 12), barrelMatBlue);
    barrel1.position.set(-19, 0.55, -2.8);
    barrel1.castShadow = true;
    this.group.add(barrel1);

    const barrelMatRed = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
    const barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.1, 12), barrelMatRed);
    barrel2.position.set(-20, 0.55, -2.7);
    barrel2.castShadow = true;
    this.group.add(barrel2);

    // 4. Oxygen Bottles / Breathing Gas Cylinders (Green)
    const o2Mat = new THREE.MeshStandardMaterial({ color: 0x16a34a, metalness: 0.6, roughness: 0.3 });
    const o2Cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 10), o2Mat);
    o2Cylinder.position.set(27, 0.6, -6.5);
    this.group.add(o2Cylinder);
  }

  private buildCagedLamps() {
    const lampPositions = [
      { x: -28, y: 4.1, z: 0, color: 0xfde047, intensity: 2.2 },
      { x: -21, y: 4.1, z: 0, color: 0xfde047, intensity: 2.2 },
      { x: -14, y: 4.1, z: 0, color: 0xfde047, intensity: 2.2 },
      { x: -7, y: 4.1, z: 0, color: 0xfde047, intensity: 2.2 },
      { x: 0, y: 4.1, z: 0, color: 0x93c5fd, intensity: 2.4 }, // Junction Alpha (Cyan daylight)
      { x: 15, y: 4.1, z: 7.2, color: 0x86efac, intensity: 2.0 }, // Safe route
      { x: 15, y: 4.1, z: -7.2, color: 0xfca5a5, intensity: 1.8 }, // Hazard zone
    ];

    lampPositions.forEach((l) => {
      // Caged Lamp Frame
      const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
      const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.38, 8), fixtureMat);
      fixture.position.set(l.x, l.y, l.z);
      this.group.add(fixture);

      // Glowing Glass Bulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 12),
        new THREE.MeshBasicMaterial({ color: l.color })
      );
      bulb.position.set(l.x, l.y - 0.16, l.z);
      this.group.add(bulb);

      // Visible PointLight casting light pool
      const light = new THREE.PointLight(l.color, l.intensity, 24, 1.4);
      light.position.set(l.x, l.y - 0.35, l.z);
      light.castShadow = true;
      this.group.add(light);
      this.tunnelLights.push(light);
    });
  }

  private buildSafetySignage() {
    // 1. Hazard Warning Sign at entrance of Tunnel B-04
    const signGroup = new THREE.Group();
    signGroup.position.set(3.5, 2.1, -2.4);
    signGroup.rotation.y = -Math.PI / 10;

    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.85, 1.3),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 })
    );
    signGroup.add(signBoard);

    // Hazard Stripes
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.22, 1.25),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    stripe.position.y = 0.28;
    signGroup.add(stripe);
    this.group.add(signGroup);

    // 2. Safe Direction Sign at South Incline Bypass
    const safeSignGroup = new THREE.Group();
    safeSignGroup.position.set(3.5, 2.1, 2.4);
    safeSignGroup.rotation.y = Math.PI / 10;

    const safeBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.7, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 })
    );
    safeSignGroup.add(safeBoard);
    this.group.add(safeSignGroup);
  }

  private buildRockfallAndDebris() {
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Visible jagged boulders
      roughness: 0.95,
      flatShading: true,
    });
    const rockGeom = new THREE.DodecahedronGeometry(0.75, 1);

    const rubblePositions = [
      { x: 13, y: 0.45, z: -5.5, s: 1.4 },
      { x: 14, y: 0.38, z: -6.4, s: 1.1 },
      { x: 15, y: 0.55, z: -5.0, s: 1.7 },
      { x: 16, y: 0.42, z: -7.8, s: 1.3 },
      { x: 17, y: 0.65, z: -8.2, s: 1.9 },
    ];

    rubblePositions.forEach((pos) => {
      const rock = new THREE.Mesh(rockGeom, rockMat);
      rock.position.set(pos.x, pos.y, pos.z);
      rock.scale.set(pos.s, pos.s * 0.7, pos.s);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.group.add(rock);
    });
  }

  private buildRefugeChamber() {
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(29, 0, -8);

    // Heavy Steel Blast Door Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.6, 5.4), frameMat);
    frame.position.set(0, 2.3, 0);
    chamberGroup.add(frame);

    // Luminescent Green Refuge Chamber Sign
    const signMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const signMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 3.0), signMat);
    signMesh.position.set(-0.65, 4.2, 0);
    chamberGroup.add(signMesh);

    // Chamber Interior Light
    const innerLight = new THREE.PointLight(0x10b981, 2.4, 15, 1.4);
    innerLight.position.set(1.5, 2.5, 0);
    chamberGroup.add(innerLight);

    this.group.add(chamberGroup);
  }

  private buildDustParticles(): THREE.Points {
    const particleCount = 380;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = Math.random() * 4.6 + 0.2;
      positions[i + 2] = (Math.random() - 0.5) * 26;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
    });

    return new THREE.Points(geometry, material);
  }

  public update(deltaSec: number) {
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - deltaSec * 0.15;
        if (y < 0.1) y = 4.6;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // Gentle realistic flicker for halogen lamps
    this.tunnelLights.forEach((light, i) => {
      const flicker = Math.sin(Date.now() / 200 + i * 3) * 0.08;
      light.intensity = 2.0 + flicker;
    });
  }
}
