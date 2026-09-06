import * as THREE from "three";

/**
 * UndergroundMineEnvironment
 * An authentic, highly detailed 3D underground coal/metal mine environment:
 * - Continuous rough rock cavern walls and arched ceilings
 * - Heavy wooden timber support sets & steel arch brackets
 * - Minecart rail tracks & wooden ties running along the tunnel floor
 * - Overhead ribbed industrial ventilation ducting (yellow flex pipe)
 * - Wall-mounted electrical conduits & high-pressure utility pipes
 * - Hanging caged halogen mining lamps casting localized light pools
 * - Rock rubble, fallen boulders, and ceiling strata fracture fissures
 * - Subsurface elevator shaft portal / Base Station C2
 * - Reinforced Refuge Chamber 7B with heavy steel blast door & safety beacon
 * - Drifting underground dust particulates & atmospheric fog
 */
export class UndergroundMineEnvironment {
  public group: THREE.Group;
  public dustParticles: THREE.Points;
  public lidarScanCloud: THREE.Points;
  public tunnelLights: THREE.PointLight[] = [];

  constructor() {
    this.group = new THREE.Group();

    // 1. Mine Cavern Floor with embedded rock roughness
    this.buildMineFloor();

    // 2. Continuous Enclosed Rock Tunnel Walls & Arched Ceilings
    this.buildRockTunnelNetwork();

    // 3. Minecart Rail Tracks & Wooden Ties along the floor
    this.buildMinecartRails();

    // 4. Heavy Timber Sets & Steel Arch Bracing along all tunnels
    this.buildTimberSupportSets();

    // 5. Overhead Mine Ventilation Ducts (Flexible ribbed yellow ducting)
    this.buildVentilationDucting();

    // 6. Wall Conduit Cables & Utility Pipes
    this.buildWallConduitsAndPipes();

    // 7. Hanging Industrial Caged Halogen Tunnel Lanterns
    this.buildIndustrialCagedLamps();

    // 8. Mining Hazard Signs & Directional Markers
    this.buildMiningSafetySignage();

    // 9. Base Station / Shaft Elevator Portal (-35m)
    this.buildSubsurfaceShaftPortal();

    // 10. Refuge Chamber 7B with Reinforced Blast Door (x=29, z=-7.8)
    this.buildRefugeChamber();

    // 11. Collapsed Rockfall Rubble in Tunnel B-04
    this.buildRockfallAndDebris();

    // 12. Atmospheric Mine Dust Particles & LiDAR registration cloud
    this.dustParticles = this.buildDustParticles();
    this.group.add(this.dustParticles);

    this.lidarScanCloud = this.buildLidarCloud();
    this.group.add(this.lidarScanCloud);
  }

  private buildMineFloor() {
    // Large cavern floor
    const floorGeom = new THREE.PlaneGeometry(120, 80, 60, 60);
    floorGeom.rotateX(-Math.PI / 2);

    const pos = floorGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Rough terrain on sides, smoother track in the center
      const distFromCenter = Math.abs(z);
      if (distFromCenter > 2.5) {
        const noise = (Math.sin(x * 0.4) * Math.cos(z * 0.4)) * 0.4;
        pos.setY(i, Math.max(0, noise));
      } else {
        // Minor roughness on haulage path
        pos.setY(i, (Math.sin(x * 1.5) * 0.04));
      }
    }
    floorGeom.computeVertexNormals();

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x181e29, // Dark coal / rock shale gravel
      roughness: 0.95,
      metalness: 0.15,
      flatShading: true,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.receiveShadow = true;
    this.group.add(floor);
  }

  private buildRockTunnelNetwork() {
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Dark jagged coal/rock walls
      roughness: 0.92,
      metalness: 0.2,
      flatShading: true,
    });

    const createCavernWall = (x: number, y: number, z: number, w: number, h: number, d: number, rotY = 0) => {
      const wallGeom = new THREE.BoxGeometry(w, h, d, 12, 6, 8);
      const p = wallGeom.attributes.position;
      // Displace vertices to create authentic jagged rock faces
      for (let i = 0; i < p.count; i++) {
        p.setX(i, p.getX(i) + (Math.sin(i * 1.7) * 0.25));
        p.setY(i, p.getY(i) + (Math.cos(i * 1.3) * 0.15));
        p.setZ(i, p.getZ(i) + (Math.sin(i * 2.1) * 0.25));
      }
      wallGeom.computeVertexNormals();
      const wall = new THREE.Mesh(wallGeom, rockMat);
      wall.position.set(x, y, z);
      wall.rotation.y = rotY;
      wall.receiveShadow = true;
      wall.castShadow = true;
      this.group.add(wall);
    };

    // Tunnel A North Wall (z = -3.8)
    createCavernWall(-18, 2.4, -4.0, 34, 5.0, 1.8);
    // Tunnel A South Wall (z = 3.8)
    createCavernWall(-18, 2.4, 4.0, 34, 5.0, 1.8);

    // Hazard Tunnel B-04 (North-East branch)
    createCavernWall(15, 2.4, -12.5, 30, 5.0, 1.8, -Math.PI / 10);
    createCavernWall(11, 2.4, -2.8, 22, 5.0, 1.8, -Math.PI / 10);

    // South Incline Bypass (South-East branch)
    createCavernWall(15, 2.4, 12.5, 30, 5.0, 1.8, Math.PI / 10);
    createCavernWall(13, 2.4, 2.8, 22, 5.0, 1.8, Math.PI / 10);

    // Tunnel Arched Rock Ceilings (Enclosed mine cavern feel)
    const createArchedRoof = (x: number, y: number, z: number, length: number, radius: number, rotY = 0) => {
      const roofGeom = new THREE.CylinderGeometry(radius, radius, length, 16, 4, true, 0, Math.PI);
      roofGeom.rotateZ(Math.PI / 2);
      roofGeom.rotateY(Math.PI / 2);

      const p = roofGeom.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setY(i, p.getY(i) + (Math.sin(i * 2.5) * 0.18));
      }
      roofGeom.computeVertexNormals();

      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.98,
        side: THREE.BackSide,
        flatShading: true,
      });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.position.set(x, y, z);
      roof.rotation.y = rotY;
      this.group.add(roof);
    };

    // Main Tunnel A Roof
    createArchedRoof(-18, 2.2, 0, 34, 4.4);
    // Hazard Tunnel Roof
    createArchedRoof(14, 2.2, -6.8, 28, 4.4, -Math.PI / 10);
    // South Incline Roof
    createArchedRoof(14, 2.2, 6.8, 28, 4.4, Math.PI / 10);
  }

  private buildMinecartRails() {
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Steel rails
      metalness: 0.9,
      roughness: 0.3,
    });
    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x451a03, // Creosote treated wooden ties / sleepers
      roughness: 0.9,
    });

    const railGroup = new THREE.Group();

    // 1. Wooden Ties along Main Tunnel A (x: -32 to 0)
    for (let x = -32; x <= 0; x += 1.4) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 2.2), tieMat);
      tie.position.set(x, 0.04, 0);
      tie.receiveShadow = true;
      railGroup.add(tie);
    }

    // Steel Rails Left & Right (Gauge = 1.4m)
    const railGeom = new THREE.BoxGeometry(32, 0.12, 0.08);
    const railL = new THREE.Mesh(railGeom, railMat);
    railL.position.set(-16, 0.12, 0.7);
    railL.castShadow = true;
    railGroup.add(railL);

    const railR = new THREE.Mesh(railGeom, railMat);
    railR.position.set(-16, 0.12, -0.7);
    railR.castShadow = true;
    railGroup.add(railR);

    // 2. Ties and rails branching into South Incline (Route B)
    for (let i = 0; i <= 20; i += 1.4) {
      const t = i / 20;
      const x = 0 + t * 24;
      const z = 0 + t * 7.5;
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 2.2), tieMat);
      tie.position.set(x, 0.04, z);
      tie.rotation.y = Math.PI / 10;
      railGroup.add(tie);
    }

    this.group.add(railGroup);
  }

  private buildTimberSupportSets() {
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Heavy rough timber beams
      roughness: 0.85,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Structural steel corner gussets
      metalness: 0.8,
      roughness: 0.35,
    });

    const setPositions = [
      { x: -30, z: 0, rotY: 0 },
      { x: -22, z: 0, rotY: 0 },
      { x: -14, z: 0, rotY: 0 },
      { x: -6, z: 0, rotY: 0 },
      { x: 1, z: 0, rotY: 0 },
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
      const arch = new THREE.Group();
      arch.position.set(pos.x, 0, pos.z);
      arch.rotation.y = pos.rotY;

      // Left Column (Timber Post)
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.4, 0.38), woodMat);
      postL.position.set(0, 2.2, -3.1);
      postL.castShadow = true;
      arch.add(postL);

      // Right Column (Timber Post)
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.4, 0.38), woodMat);
      postR.position.set(0, 2.2, 3.1);
      postR.castShadow = true;
      arch.add(postR);

      // Top Timber Collar / Crossbeam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.4, 6.6), woodMat);
      beam.position.set(0, 4.3, 0);
      beam.castShadow = true;
      arch.add(beam);

      // Steel gusset brackets
      const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), steelMat);
      bracketL.position.set(0, 4.2, -3.0);
      arch.add(bracketL);

      const bracketR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), steelMat);
      bracketR.position.set(0, 4.2, 3.0);
      arch.add(bracketR);

      this.group.add(arch);
    });
  }

  private buildVentilationDucting() {
    // Overhead flexible yellow/orange ribbed ventilation duct
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Safety yellow/orange mine vent bag
      roughness: 0.6,
      metalness: 0.2,
    });

    const createDuct = (x: number, y: number, z: number, length: number, rotY = 0) => {
      const ductGeom = new THREE.CylinderGeometry(0.42, 0.42, length, 16);
      ductGeom.rotateZ(Math.PI / 2);
      const duct = new THREE.Mesh(ductGeom, ductMat);
      duct.position.set(x, y, z);
      duct.rotation.y = rotY;
      duct.castShadow = true;
      this.group.add(duct);
    };

    // Main tunnel vent line
    createDuct(-16, 3.8, -2.1, 32);
    // Branching into South Incline
    createDuct(14, 3.8, 4.8, 26, Math.PI / 10);
  }

  private buildWallConduitsAndPipes() {
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Steel utility water/air pipe
      metalness: 0.8,
      roughness: 0.3,
    });
    const cableMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Heavy black high-voltage power cable
      roughness: 0.9,
    });

    const createPipeRun = (x: number, y: number, z: number, length: number, rotY = 0) => {
      // Pipe
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, length, 8), pipeMat);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(x, y, z);
      pipe.rotation.y = rotY;
      this.group.add(pipe);

      // Power Cable bundle below pipe
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, length, 6), cableMat);
      cable.rotation.z = Math.PI / 2;
      cable.position.set(x, y - 0.2, z);
      cable.rotation.y = rotY;
      this.group.add(cable);
    };

    createPipeRun(-16, 1.6, -3.4, 32);
    createPipeRun(14, 1.6, -9.5, 26, -Math.PI / 10);
    createPipeRun(14, 1.6, 9.5, 26, Math.PI / 10);
  }

  private buildIndustrialCagedLamps() {
    const lampPositions = [
      { x: -28, y: 4.1, z: 0, color: 0xfef08a, intensity: 1.6 },
      { x: -14, y: 4.1, z: 0, color: 0xfef08a, intensity: 1.6 },
      { x: 1, y: 4.1, z: 0, color: 0x93c5fd, intensity: 1.8 },
      { x: 15, y: 4.1, z: 7.2, color: 0x86efac, intensity: 1.5 },
      { x: 15, y: 4.1, z: -7.2, color: 0xfca5a5, intensity: 1.3 },
    ];

    lampPositions.forEach((l) => {
      // Caged lamp fixture
      const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
      const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 8), fixtureMat);
      fixture.position.set(l.x, l.y, l.z);
      this.group.add(fixture);

      // Glowing glass bulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshBasicMaterial({ color: l.color })
      );
      bulb.position.set(l.x, l.y - 0.15, l.z);
      this.group.add(bulb);

      // PointLight illuminating the tunnel section
      const light = new THREE.PointLight(l.color, l.intensity, 22, 1.6);
      light.position.set(l.x, l.y - 0.3, l.z);
      light.castShadow = true;
      this.group.add(light);
      this.tunnelLights.push(light);
    });
  }

  private buildMiningSafetySignage() {
    // 1. Hazard Warning Sign at entrance of Tunnel B-04
    const signGroup = new THREE.Group();
    signGroup.position.set(4, 2.0, -2.6);
    signGroup.rotation.y = -Math.PI / 10;

    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.8, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
    );
    signGroup.add(signBoard);

    // Hazard Stripes Header
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.2, 1.15),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    stripe.position.y = 0.25;
    signGroup.add(stripe);

    this.group.add(signGroup);

    // 2. Safe Direction Arrow Sign at South Incline Bypass
    const safeSignGroup = new THREE.Group();
    safeSignGroup.position.set(4, 2.0, 2.6);
    safeSignGroup.rotation.y = Math.PI / 10;

    const safeBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.6, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.5 })
    );
    safeSignGroup.add(safeBoard);
    this.group.add(safeSignGroup);
  }

  private buildSubsurfaceShaftPortal() {
    const portalGroup = new THREE.Group();
    portalGroup.position.set(-35, 0, 0);

    // Reinforced Concrete Tunnel Entrance Portal
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.3,
    });
    const archFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.6, 8.2), portalMat);
    archFrame.position.set(0, 2.8, 0);
    portalGroup.add(archFrame);

    // Yellow / Black Hazard Chevron Header
    const signMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 5.4), signMat);
    sign.position.set(0.95, 5.0, 0);
    portalGroup.add(sign);

    // Subsurface Mesh Antenna Tower
    const towerGeom = new THREE.CylinderGeometry(0.12, 0.22, 7.5, 8);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.set(0.6, 3.75, 4.5);
    portalGroup.add(tower);

    // Flashing Base C2 Beacon
    const beaconGeom = new THREE.SphereGeometry(0.25, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(0.6, 7.6, 4.5);
    portalGroup.add(beacon);

    this.group.add(portalGroup);
  }

  private buildRefugeChamber() {
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(29, 0, -8);

    // Heavy Reinforced Steel Blast Door Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.6, 5.4), frameMat);
    frame.position.set(0, 2.3, 0);
    chamberGroup.add(frame);

    // Luminescent Green Refuge Chamber Sign
    const signMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const signMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 2.8), signMat);
    signMesh.position.set(-0.65, 4.2, 0);
    chamberGroup.add(signMesh);

    // Chamber Interior Light
    const innerLight = new THREE.PointLight(0x10b981, 2.2, 14, 1.4);
    innerLight.position.set(1.5, 2.5, 0);
    chamberGroup.add(innerLight);

    this.group.add(chamberGroup);
  }

  private buildRockfallAndDebris() {
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.95,
      flatShading: true,
    });
    const rockGeom = new THREE.DodecahedronGeometry(0.7, 1);

    const rubblePositions = [
      { x: 13, y: 0.4, z: -5.5, s: 1.4 },
      { x: 14, y: 0.35, z: -6.4, s: 1.0 },
      { x: 15, y: 0.5, z: -5.0, s: 1.6 },
      { x: 16, y: 0.4, z: -7.8, s: 1.3 },
      { x: 17, y: 0.6, z: -8.2, s: 1.8 },
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

  private buildLidarCloud(): THREE.Points {
    const pointCount = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 75;
      positions[i + 1] = Math.random() * 4.4 + 0.1;
      positions[i + 2] = (Math.random() - 0.5) * 24;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x38bdf8, // Cyan LiDAR point cloud
      size: 0.06,
      transparent: true,
      opacity: 0.55,
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

    // Flicker underground lantern lights subtly
    this.tunnelLights.forEach((light, i) => {
      const flicker = Math.sin(Date.now() / 200 + i * 3) * 0.1;
      light.intensity = 1.5 + flicker;
    });
  }
}
