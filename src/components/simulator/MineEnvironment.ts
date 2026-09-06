import * as THREE from "three";

export class MineEnvironment {
  public group: THREE.Group;
  public dustParticles: THREE.Points;
  public tunnelLights: THREE.PointLight[] = [];

  constructor() {
    this.group = new THREE.Group();

    // 1. Mine Floor (Dark rocky textured gravel)
    const floorGeom = new THREE.PlaneGeometry(120, 80, 40, 40);
    floorGeom.rotateX(-Math.PI / 2);
    
    // Add subtle procedural roughness to the ground vertices
    const pos = floorGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // keep main corridor smooth for rover, perturb sides
      const distFromCenter = Math.abs(z);
      if (distFromCenter > 3) {
        const noise = (Math.sin(x * 0.3) + Math.cos(z * 0.3)) * 0.25;
        pos.setY(i, Math.max(0, noise));
      }
    }
    floorGeom.computeVertexNormals();

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // slate-800
      roughness: 0.95,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.receiveShadow = true;
    this.group.add(floor);

    // 2. Build Tunnels: Walls & Rock Strata
    this.buildTunnelWalls();

    // 3. Wooden / Steel Timber Support Sets along Tunnels
    this.buildTimberSupportArches();

    // 4. Subsurface Base Station / Portal Entrance
    this.buildBaseStationPortal();

    // 5. Refuge Chamber 7B (Safe Room with Blast Door)
    this.buildRefugeChamber();

    // 6. Rubble & Rock Piles in Hazard Tunnel B-04
    this.buildRubblePiles();

    // 7. Tunnel Ambient Tube Lights
    this.buildTunnelLights();

    // 8. Atmospheric Dust Particle System
    this.dustParticles = this.buildDustParticles();
    this.group.add(this.dustParticles);
  }

  private buildTunnelWalls() {
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // dark slate
      roughness: 0.9,
      metalness: 0.2,
    });

    // Helper to create rock wall segments
    const createWallSegment = (x: number, y: number, z: number, w: number, h: number, d: number, rotY = 0) => {
      const wallGeom = new THREE.BoxGeometry(w, h, d, 8, 4, 8);
      const p = wallGeom.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setX(i, p.getX(i) + (Math.sin(i * 1.5) * 0.15));
        p.setZ(i, p.getZ(i) + (Math.cos(i * 1.7) * 0.15));
      }
      wallGeom.computeVertexNormals();
      const wall = new THREE.Mesh(wallGeom, wallMat);
      wall.position.set(x, y, z);
      wall.rotation.y = rotY;
      wall.receiveShadow = true;
      wall.castShadow = true;
      this.group.add(wall);
    };

    // Tunnel A North Wall (z = -3.5)
    createWallSegment(-20, 2.2, -3.5, 30, 4.5, 1.2);
    // Tunnel A South Wall (z = 3.5)
    createWallSegment(-20, 2.2, 3.5, 30, 4.5, 1.2);

    // Hazard Tunnel B-04 (North-East angle)
    createWallSegment(16, 2.2, -11.5, 26, 4.5, 1.2, -Math.PI / 12);
    createWallSegment(12, 2.2, -2.5, 18, 4.5, 1.2, -Math.PI / 12);

    // South Incline Bypass (South-East angle)
    createWallSegment(16, 2.2, 11.5, 26, 4.5, 1.2, Math.PI / 12);
    createWallSegment(14, 2.2, 2.5, 18, 4.5, 1.2, Math.PI / 12);

    // Tunnel Roof arches (translucent rock ribs)
    const roofGeom = new THREE.CylinderGeometry(4.2, 4.2, 35, 16, 1, true, 0, Math.PI);
    roofGeom.rotateZ(Math.PI / 2);
    roofGeom.rotateY(Math.PI / 2);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.95,
      side: THREE.BackSide,
    });
    const roofA = new THREE.Mesh(roofGeom, roofMat);
    roofA.position.set(-18, 1.8, 0);
    this.group.add(roofA);
  }

  private buildTimberSupportArches() {
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // amber-900 timber
      roughness: 0.8,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // slate-600 steel bracket
      metalness: 0.7,
      roughness: 0.3,
    });

    const archPositions = [
      { x: -30, z: 0, rotY: 0 },
      { x: -22, z: 0, rotY: 0 },
      { x: -14, z: 0, rotY: 0 },
      { x: -6, z: 0, rotY: 0 },
      { x: 2, z: 0, rotY: 0 },
      // Hazard Tunnel Arches
      { x: 8, z: -4.5, rotY: -Math.PI / 12 },
      { x: 16, z: -7.0, rotY: -Math.PI / 12 },
      { x: 24, z: -8.0, rotY: -Math.PI / 12 },
      // Safe Route Arches
      { x: 8, z: 4.5, rotY: Math.PI / 12 },
      { x: 16, z: 7.0, rotY: Math.PI / 12 },
      { x: 24, z: 5.0, rotY: 0 },
    ];

    archPositions.forEach((pos) => {
      const arch = new THREE.Group();
      arch.position.set(pos.x, 0, pos.z);
      arch.rotation.y = pos.rotY;

      // Left post
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.0, 0.35), woodMat);
      postL.position.set(0, 2.0, -2.8);
      postL.castShadow = true;
      arch.add(postL);

      // Right post
      const postR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.0, 0.35), woodMat);
      postR.position.set(0, 2.0, 2.8);
      postR.castShadow = true;
      arch.add(postR);

      // Top Crossbeam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 6.0), woodMat);
      beam.position.set(0, 3.9, 0);
      beam.castShadow = true;
      arch.add(beam);

      // Steel Corner Brackets
      const bracketL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), steelMat);
      bracketL.position.set(0, 3.8, -2.7);
      arch.add(bracketL);

      const bracketR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), steelMat);
      bracketR.position.set(0, 3.8, 2.7);
      arch.add(bracketR);

      this.group.add(arch);
    });
  }

  private buildBaseStationPortal() {
    const portalGroup = new THREE.Group();
    portalGroup.position.set(-35, 0, 0);

    // Concrete Portal Arch
    const portalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const archFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5.2, 7.5), portalMat);
    archFrame.position.set(0, 2.6, 0);
    portalGroup.add(archFrame);

    // Safety Hazard Stripes Frame
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 5.0), stripeMat);
    sign.position.set(0.8, 4.6, 0);
    portalGroup.add(sign);

    // Base Communication Antenna Tower
    const towerGeom = new THREE.CylinderGeometry(0.12, 0.2, 6.5, 8);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.set(0.5, 3.25, 4.2);
    portalGroup.add(tower);

    // Flashing Base Relay Beacon
    const beaconGeom = new THREE.SphereGeometry(0.22, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 }); // Blue base beacon
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(0.5, 6.6, 4.2);
    portalGroup.add(beacon);

    this.group.add(portalGroup);
  }

  private buildRefugeChamber() {
    const chamberGroup = new THREE.Group();
    chamberGroup.position.set(29, 0, -8);

    // Heavy Reinforced Steel Blast Door Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.2, 5.0), frameMat);
    frame.position.set(0, 2.1, 0);
    chamberGroup.add(frame);

    // Refuge Sign (Luminescent Green)
    const signMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const signMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 2.4), signMat);
    signMesh.position.set(-0.55, 3.8, 0);
    chamberGroup.add(signMesh);

    // Chamber Interior Floor
    const innerFloorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const innerFloor = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), innerFloorMat);
    innerFloor.rotateX(-Math.PI / 2);
    innerFloor.position.set(3, 0.05, 0);
    chamberGroup.add(innerFloor);

    // Soft Interior Light
    const innerLight = new THREE.PointLight(0x10b981, 1.5, 10, 1.5);
    innerLight.position.set(1.5, 2.5, 0);
    chamberGroup.add(innerLight);

    this.group.add(chamberGroup);
  }

  private buildRubblePiles() {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95 });
    const rockGeom = new THREE.DodecahedronGeometry(0.6, 1);

    const rubblePositions = [
      { x: 13, y: 0.3, z: -5.5, s: 1.2 },
      { x: 14, y: 0.25, z: -6.2, s: 0.8 },
      { x: 15, y: 0.4, z: -5.0, s: 1.4 },
      { x: 16, y: 0.3, z: -7.5, s: 1.1 },
      { x: 17, y: 0.5, z: -8.0, s: 1.6 },
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

  private buildTunnelLights() {
    const lightPositions = [
      { x: -28, y: 3.5, z: 0, color: 0xfde047, intensity: 1.0 },
      { x: -14, y: 3.5, z: 0, color: 0xfde047, intensity: 1.0 },
      { x: 0, y: 3.5, z: 0, color: 0x93c5fd, intensity: 1.2 },
      { x: 14, y: 3.5, z: 6.5, color: 0x86efac, intensity: 1.0 },
      { x: 14, y: 3.5, z: -6.5, color: 0xfca5a5, intensity: 0.8 },
    ];

    lightPositions.forEach((l) => {
      const light = new THREE.PointLight(l.color, l.intensity, 18, 1.8);
      light.position.set(l.x, l.y, l.z);
      this.group.add(light);
      this.tunnelLights.push(light);

      // Small lantern bulb mesh
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: l.color }));
      bulb.position.set(l.x, l.y, l.z);
      this.group.add(bulb);
    });
  }

  private buildDustParticles(): THREE.Points {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;     // X: -40 to 40
      positions[i + 1] = Math.random() * 4.5 + 0.2; // Y: 0.2 to 4.7
      positions[i + 2] = (Math.random() - 0.5) * 24; // Z: -12 to 12
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
    // Animate subtle drifting dust motes
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - deltaSec * 0.15;
        if (y < 0.1) y = 4.5;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // Gentle realistic flickering for underground mine lantern lights
    this.tunnelLights.forEach((light, i) => {
      const flicker = Math.sin(Date.now() / 200 + i * 3) * 0.08;
      light.intensity = 1.0 + flicker;
    });
  }
}
