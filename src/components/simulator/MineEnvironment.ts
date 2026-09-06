import * as THREE from "three";

export class MineEnvironment {
  public group: THREE.Group;
  public dustParticles: THREE.Points;
  public lidarScanPoints: THREE.Points;
  public tunnelLights: THREE.PointLight[] = [];
  public emergencyBeacons: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();

    // 1. Mine Floor (Dark rocky textured gravel with tire tracks)
    const floorGeom = new THREE.PlaneGeometry(120, 80, 48, 48);
    floorGeom.rotateX(-Math.PI / 2);
    
    // Procedural terrain displacement
    const pos = floorGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distFromCenter = Math.abs(z);
      if (distFromCenter > 2.8) {
        const noise = (Math.sin(x * 0.35) * Math.cos(z * 0.35)) * 0.45;
        pos.setY(i, Math.max(0, noise));
      }
    }
    floorGeom.computeVertexNormals();

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Deep charcoal slate
      roughness: 0.95,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.receiveShadow = true;
    this.group.add(floor);

    // 2. Build Tunnels: Walls & Rock Strata
    this.buildTunnelWalls();

    // 3. Wooden & Steel Timber Support Sets along Tunnels
    this.buildTimberSupportArches();

    // 4. Subsurface Base Station / Shaft Portal
    this.buildBaseStationPortal();

    // 5. Refuge Chamber 7B (Safe Room with Blast Door & Signage)
    this.buildRefugeChamber();

    // 6. Rubble & Rock Piles in Hazard Tunnel B-04
    this.buildRubblePiles();

    // 7. Tunnel Industrial Tube Lights & Warning Signs
    this.buildTunnelLightsAndSigns();

    // 8. Atmospheric Dust Particle System
    this.dustParticles = this.buildDustParticles();
    this.group.add(this.dustParticles);

    // 9. LiDAR Point Cloud Registration Mesh
    this.lidarScanPoints = this.buildLidarPointCloud();
    this.group.add(this.lidarScanPoints);
  }

  private buildTunnelWalls() {
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d, // Deep subterranean rock
      roughness: 0.92,
      metalness: 0.25,
      flatShading: true,
    });

    const createWallSegment = (x: number, y: number, z: number, w: number, h: number, d: number, rotY = 0) => {
      const wallGeom = new THREE.BoxGeometry(w, h, d, 8, 4, 8);
      const p = wallGeom.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setX(i, p.getX(i) + (Math.sin(i * 1.5) * 0.2));
        p.setZ(i, p.getZ(i) + (Math.cos(i * 1.7) * 0.2));
      }
      wallGeom.computeVertexNormals();
      const wall = new THREE.Mesh(wallGeom, wallMat);
      wall.position.set(x, y, z);
      wall.rotation.y = rotY;
      wall.receiveShadow = true;
      wall.castShadow = true;
      this.group.add(wall);
    };

    // Tunnel A North Wall (z = -3.8)
    createWallSegment(-20, 2.4, -3.8, 30, 4.8, 1.4);
    // Tunnel A South Wall (z = 3.8)
    createWallSegment(-20, 2.4, 3.8, 30, 4.8, 1.4);

    // Hazard Tunnel B-04 (North-East angle)
    createWallSegment(16, 2.4, -12.0, 28, 4.8, 1.4, -Math.PI / 10);
    createWallSegment(12, 2.4, -2.8, 20, 4.8, 1.4, -Math.PI / 10);

    // South Incline Bypass (South-East angle)
    createWallSegment(16, 2.4, 12.0, 28, 4.8, 1.4, Math.PI / 10);
    createWallSegment(14, 2.4, 2.8, 20, 4.8, 1.4, Math.PI / 10);

    // Arched Rock Ceiling
    const roofGeom = new THREE.CylinderGeometry(4.4, 4.4, 35, 16, 1, true, 0, Math.PI);
    roofGeom.rotateZ(Math.PI / 2);
    roofGeom.rotateY(Math.PI / 2);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x050914,
      roughness: 0.98,
      side: THREE.BackSide,
    });
    const roofA = new THREE.Mesh(roofGeom, roofMat);
    roofA.position.set(-18, 2.0, 0);
    this.group.add(roofA);
  }

  private buildTimberSupportArches() {
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5c2b09, // Heavy mining timber
      roughness: 0.85,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Structural steel
      metalness: 0.8,
      roughness: 0.3,
    });

    const archPositions = [
      { x: -30, z: 0, rotY: 0 },
      { x: -22, z: 0, rotY: 0 },
      { x: -14, z: 0, rotY: 0 },
      { x: -6, z: 0, rotY: 0 },
      { x: 2, z: 0, rotY: 0 },
      { x: 8, z: -4.5, rotY: -Math.PI / 10 },
      { x: 16, z: -7.2, rotY: -Math.PI / 10 },
      { x: 24, z: -8.0, rotY: -Math.PI / 10 },
      { x: 8, z: 4.5, rotY: Math.PI / 10 },
      { x: 16, z: 7.2, rotY: Math.PI / 10 },
      { x: 24, z: 5.0, rotY: 0 },
    ];

    archPositions.forEach((pos) => {
      const arch = new THREE.Group();
      arch.position.set(pos.x, 0, pos.z);
      arch.rotation.y = pos.rotY;

      // Left column
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 0.35), woodMat);
      postL.position.set(0, 2.1, -2.9);
      postL.castShadow = true;
      arch.add(postL);

      // Right column
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 0.35), woodMat);
      postR.position.set(0, 2.1, 2.9);
      postR.castShadow = true;
      arch.add(postR);

      // Top Crossbeam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.38, 6.2), woodMat);
      beam.position.set(0, 4.1, 0);
      beam.castShadow = true;
      arch.add(beam);

      // Steel gusset plates
      const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), steelMat);
      bracketL.position.set(0, 4.0, -2.8);
      arch.add(bracketL);

      const bracketR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), steelMat);
      bracketR.position.set(0, 4.0, 2.8);
      arch.add(bracketR);

      this.group.add(arch);
    });
  }

  private buildBaseStationPortal() {
    const portalGroup = new THREE.Group();
    portalGroup.position.set(-35, 0, 0);

    // Concrete Shaft Portal Frame
    const portalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75, metalness: 0.3 });
    const archFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.4, 7.8), portalMat);
    archFrame.position.set(0, 2.7, 0);
    portalGroup.add(archFrame);

    // Base Station Warning Header (Yellow / Black Hazard Stripes)
    const signMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 5.2), signMat);
    sign.position.set(0.85, 4.8, 0);
    portalGroup.add(sign);

    // Mesh Communication Tower
    const towerGeom = new THREE.CylinderGeometry(0.12, 0.22, 7.0, 8);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.set(0.5, 3.5, 4.4);
    portalGroup.add(tower);

    // Flashing Base Relay Beacon
    const beaconGeom = new THREE.SphereGeometry(0.25, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(0.5, 7.1, 4.4);
    portalGroup.add(beacon);

    this.group.add(portalGroup);
  }

  private buildRefugeChamber() {
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(29, 0, -8);

    // Heavy Reinforced Blast Door Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.4, 5.2), frameMat);
    frame.position.set(0, 2.2, 0);
    chamberGroup.add(frame);

    // Luminescent Refuge Chamber Sign
    const signMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const signMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 2.6), signMat);
    signMesh.position.set(-0.65, 4.0, 0);
    chamberGroup.add(signMesh);

    // Chamber Interior Light
    const innerLight = new THREE.PointLight(0x10b981, 1.8, 12, 1.5);
    innerLight.position.set(1.5, 2.5, 0);
    chamberGroup.add(innerLight);

    this.group.add(chamberGroup);
  }

  private buildRubblePiles() {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95, flatShading: true });
    const rockGeom = new THREE.DodecahedronGeometry(0.65, 1);

    const rubblePositions = [
      { x: 13, y: 0.35, z: -5.5, s: 1.3 },
      { x: 14, y: 0.3, z: -6.4, s: 0.9 },
      { x: 15, y: 0.45, z: -5.0, s: 1.5 },
      { x: 16, y: 0.35, z: -7.8, s: 1.2 },
      { x: 17, y: 0.55, z: -8.2, s: 1.7 },
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

  private buildTunnelLightsAndSigns() {
    const lightPositions = [
      { x: -28, y: 3.6, z: 0, color: 0xfef08a, intensity: 1.1 },
      { x: -14, y: 3.6, z: 0, color: 0xfef08a, intensity: 1.1 },
      { x: 0, y: 3.6, z: 0, color: 0x93c5fd, intensity: 1.3 },
      { x: 14, y: 3.6, z: 6.8, color: 0x86efac, intensity: 1.1 },
      { x: 14, y: 3.6, z: -6.8, color: 0xfca5a5, intensity: 0.9 },
    ];

    lightPositions.forEach((l) => {
      const light = new THREE.PointLight(l.color, l.intensity, 20, 1.8);
      light.position.set(l.x, l.y, l.z);
      this.group.add(light);
      this.tunnelLights.push(light);

      // Industrial Lamp Housing & Bulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: l.color })
      );
      bulb.position.set(l.x, l.y, l.z);
      this.group.add(bulb);
    });

    // Warning Sign at Entrance of Hazard Tunnel B-04
    const signGroup = new THREE.Group();
    signGroup.position.set(4, 2.2, -2.5);
    signGroup.rotation.y = -Math.PI / 10;

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 })
    );
    post.position.y = 1.1;
    signGroup.add(post);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.6, 0.8),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    plate.position.set(0, 1.8, 0);
    signGroup.add(plate);

    this.group.add(signGroup);
  }

  private buildDustParticles(): THREE.Points {
    const particleCount = 320;
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
      opacity: 0.4,
    });

    return new THREE.Points(geometry, material);
  }

  private buildLidarPointCloud(): THREE.Points {
    // 600 LiDAR scan points synthesized dynamically
    const pointCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 70;
      positions[i + 1] = Math.random() * 4.2 + 0.1;
      positions[i + 2] = (Math.random() - 0.5) * 22;
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

  public update(deltaSec: number, roverX = 0) {
    // Animate subtle drifting dust motes
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - deltaSec * 0.14;
        if (y < 0.1) y = 4.6;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // Flicker underground lantern lights
    this.tunnelLights.forEach((light, i) => {
      const flicker = Math.sin(Date.now() / 200 + i * 3) * 0.08;
      light.intensity = 1.1 + flicker;
    });
  }
}
