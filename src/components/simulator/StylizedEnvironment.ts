import * as THREE from "three";

/**
 * Stylized Low-Poly Floating Track & Island Environment
 * Matches the user's reference screenshot:
 * - Elevated emerald/teal trackway with terracotta rounded guardrail borders
 * - Tapered dark floating rock pillars underneath
 * - Blocky low-poly turquoise/cyan trees on satellite islands
 * - Giant low-poly pyramid mountain & dome pillars in the horizon
 * - Deep twilight sky gradient with golden horizon & dark indigo void
 */
export class StylizedEnvironment {
  public group: THREE.Group;
  public skyMesh: THREE.Mesh;
  public floatingIslands: THREE.Group;

  constructor() {
    this.group = new THREE.Group();

    // 1. Twilight / Golden Hour Sky Dome
    this.skyMesh = this.buildSkyDome();
    this.group.add(this.skyMesh);

    // 2. Endless Dark Indigo Void Floor / Ocean
    const voidGeom = new THREE.PlaneGeometry(600, 600);
    voidGeom.rotateX(-Math.PI / 2);
    const voidMat = new THREE.MeshStandardMaterial({
      color: 0x03071e, // Deep midnight navy void
      roughness: 0.2,
      metalness: 0.8,
    });
    const voidMesh = new THREE.Mesh(voidGeom, voidMat);
    voidMesh.position.y = -8;
    this.group.add(voidMesh);

    // 3. Main Floating Trackway (Elevated with terracotta curb rails and teal top)
    this.buildFloatingTrackway();

    // 4. Background Landmarks (Pyramid Mountain, Dome Pillar, Distant Islands)
    this.buildBackgroundLandmarks();

    // 5. Stylized Low-Poly Foliage & Blocky Trees
    this.floatingIslands = new THREE.Group();
    this.buildSatelliteIslandsWithTrees();
    this.group.add(this.floatingIslands);
  }

  private buildSkyDome(): THREE.Mesh {
    // Large hemisphere sky with custom twilight gradient shader
    const skyGeom = new THREE.SphereGeometry(250, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    
    // Vertex & fragment shader for golden sunset horizon into deep indigo sky
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x0284c7) },    // Sky blue
        midColor: { value: new THREE.Color(0x38bdf8) },    // Bright cyan
        horizonColor: { value: new THREE.Color(0xfde047) },// Golden sunset
        voidColor: { value: new THREE.Color(0x020617) },   // Deep dark night void
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 voidColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 sky;
          if (h > 0.3) {
            sky = mix(midColor, topColor, (h - 0.3) / 0.7);
          } else if (h > 0.05) {
            sky = mix(horizonColor, midColor, (h - 0.05) / 0.25);
          } else {
            sky = mix(voidColor, horizonColor, max(0.0, h) / 0.05);
          }
          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    });

    const sky = new THREE.Mesh(skyGeom, skyMat);
    sky.position.y = -8;
    return sky;
  }

  private buildFloatingTrackway() {
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488, // Teal / Emerald green track surface (matches screenshot)
      roughness: 0.6,
      metalness: 0.1,
    });

    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xc2410c, // Terracotta / warm brown border rails (matches screenshot)
      roughness: 0.4,
      metalness: 0.15,
    });

    const cliffMat = new THREE.MeshStandardMaterial({
      color: 0x090d16, // Dark slate / obsidian floating cliff underbody
      roughness: 0.9,
      metalness: 0.2,
      flatShading: true,
    });

    // Helper to create a track segment with raised terracotta borders and tapered floating base
    const createTrackSegment = (
      x: number,
      z: number,
      w: number,
      d: number,
      rotY = 0
    ) => {
      const segGroup = new THREE.Group();
      segGroup.position.set(x, 0, z);
      segGroup.rotation.y = rotY;

      // 1. Flat Track Top
      const topGeom = new THREE.BoxGeometry(w, 0.4, d);
      const topMesh = new THREE.Mesh(topGeom, trackMat);
      topMesh.position.y = 0.2;
      topMesh.receiveShadow = true;
      segGroup.add(topMesh);

      // 2. Terracotta Left & Right Rounded Border Rails
      const railH = 0.45;
      const railW = 0.35;
      const railGeomL = new THREE.BoxGeometry(w, railH, railW);
      const railL = new THREE.Mesh(railGeomL, borderMat);
      railL.position.set(0, 0.35, d / 2 - railW / 2);
      railL.castShadow = true;
      segGroup.add(railL);

      const railR = new THREE.Mesh(railGeomL, borderMat);
      railR.position.set(0, 0.35, -d / 2 + railW / 2);
      railR.castShadow = true;
      segGroup.add(railR);

      // 3. Tapered Dark Floating Island Base Underneath
      const baseH = 6.5;
      const baseGeom = new THREE.CylinderGeometry(
        Math.min(w, d) * 0.48,
        Math.min(w, d) * 0.12,
        baseH,
        7
      );
      const baseMesh = new THREE.Mesh(baseGeom, cliffMat);
      baseMesh.position.y = -baseH / 2;
      baseMesh.scale.set(w / Math.min(w, d), 1, d / Math.min(w, d));
      baseMesh.castShadow = true;
      segGroup.add(baseMesh);

      this.group.add(segGroup);
    };

    // Trackway layout matching the mission waypoint path
    // Main Haulage Track (Section 1: -32 to 0)
    createTrackSegment(-16, 0, 34, 6.0, 0);

    // Hazard Drift B-04 (Section 2: 0 to 28, angled North-East)
    createTrackSegment(14, -6.5, 30, 6.0, -Math.PI / 10);

    // South Incline Bypass (Section 3: 0 to 28, angled South-East)
    createTrackSegment(14, 8.0, 30, 6.0, Math.PI / 10);

    // Destination / Refuge Chamber Island (x = 29, z = -7.8)
    const endPlatform = new THREE.Group();
    endPlatform.position.set(29, 0, -7.8);
    const endTop = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 0.5, 12), trackMat);
    endTop.position.y = 0.25;
    endPlatform.add(endTop);

    // End platform border
    const endRail = new THREE.Mesh(new THREE.TorusGeometry(5.0, 0.25, 8, 24), borderMat);
    endRail.rotation.x = Math.PI / 2;
    endRail.position.y = 0.45;
    endPlatform.add(endRail);

    // End platform tapered cliff
    const endBase = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 0.8, 8.0, 8), cliffMat);
    endBase.position.y = -4.0;
    endPlatform.add(endBase);
    this.group.add(endPlatform);

    // Circular hazard crater indentations on the track (matches circles in screenshot)
    const craterMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.8 });
    const craterGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 16);
    const crater1 = new THREE.Mesh(craterGeom, craterMat);
    crater1.position.set(6, 0.41, -4.0);
    this.group.add(crater1);

    const crater2 = new THREE.Mesh(craterGeom, craterMat);
    crater2.position.set(12, 0.41, -6.0);
    this.group.add(crater2);

    const crater3 = new THREE.Mesh(craterGeom, craterMat);
    crater3.position.set(18, 0.41, -7.5);
    this.group.add(crater3);
  }

  private buildBackgroundLandmarks() {
    // 1. Giant Low-Poly Dual-Tone Pyramid Mountain (From reference screenshot)
    const mountainGroup = new THREE.Group();
    mountainGroup.position.set(20, -4, -48);

    // Darker lower base pyramid
    const basePyramidGeom = new THREE.ConeGeometry(28, 38, 4, 1, false);
    basePyramidGeom.rotateY(Math.PI / 4);
    const basePyramidMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a5f, // Deep slate-blue
      roughness: 0.7,
      flatShading: true,
    });
    const basePyramid = new THREE.Mesh(basePyramidGeom, basePyramidMat);
    basePyramid.position.y = 10;
    mountainGroup.add(basePyramid);

    // Upper light-blue / ice cap pyramid
    const topPyramidGeom = new THREE.ConeGeometry(14, 18, 4, 1, false);
    topPyramidGeom.rotateY(Math.PI / 4);
    const topPyramidMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd, // Light sky-blue snowcap
      roughness: 0.5,
      flatShading: true,
    });
    const topPyramid = new THREE.Mesh(topPyramidGeom, topPyramidMat);
    topPyramid.position.y = 20;
    mountainGroup.add(topPyramid);

    this.group.add(mountainGroup);

    // 2. Floating Green Dome / Chalice Pillar (From reference screenshot)
    const domePillar = new THREE.Group();
    domePillar.position.set(-6, 2, -38);

    // Tapered dark base
    const chaliceBase = new THREE.Mesh(
      new THREE.CylinderGeometry(7, 1.2, 18, 8),
      new THREE.MeshStandardMaterial({ color: 0x0b1329, roughness: 0.8, flatShading: true })
    );
    chaliceBase.position.y = -3;
    domePillar.add(chaliceBase);

    // Green Dome top
    const greenDome = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6, flatShading: true })
    );
    greenDome.position.y = 6;
    domePillar.add(greenDome);

    this.group.add(domePillar);
  }

  private buildSatelliteIslandsWithTrees() {
    const islandPositions = [
      { x: 3, z: 2.0, r: 2.8 },
      { x: 14, z: 0.5, r: 3.2 },
      { x: -8, z: -8.0, r: 2.4 },
      { x: 22, z: -14.0, r: 3.5 },
      { x: -22, z: 8.0, r: 2.8 },
    ];

    islandPositions.forEach((pos, idx) => {
      const island = new THREE.Group();
      island.position.set(pos.x, -0.5, pos.z);

      // Top green disc
      const topGeom = new THREE.CylinderGeometry(pos.r, pos.r, 0.4, 7);
      const topMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6, flatShading: true });
      const top = new THREE.Mesh(topGeom, topMat);
      island.add(top);

      // Tapered floating underbody
      const baseGeom = new THREE.CylinderGeometry(pos.r, 0.2, 5.5, 6);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1d, roughness: 0.9, flatShading: true });
      const base = new THREE.Mesh(baseGeom, baseMat);
      base.position.y = -2.8;
      island.add(base);

      // Low-Poly Cubic Turquoise Tree (Matches screenshot)
      const tree = this.buildLowPolyTree();
      tree.position.set(0, 0.2, 0);
      island.add(tree);

      // Add small crystals / mushrooms
      const mushroom = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.2, 0),
        new THREE.MeshStandardMaterial({ color: idx % 2 === 0 ? 0xf43f5e : 0x38bdf8 })
      );
      mushroom.position.set(pos.r * 0.4, 0.3, pos.r * 0.3);
      island.add(mushroom);

      this.floatingIslands.add(island);
    });
  }

  private buildLowPolyTree(): THREE.Group {
    const treeGroup = new THREE.Group();

    // Stylized Grey/Brown Trunk
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8, flatShading: true });
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.8, 0.35), trunkMat);
    trunk.position.y = 0.9;
    treeGroup.add(trunk);

    // Blocky Cubic Foliage (Turquoise / Cyan from screenshot)
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Bright Cyan / Turquoise (matches screenshot)
      roughness: 0.4,
      flatShading: true,
    });

    const leafPositions = [
      { x: 0, y: 2.2, z: 0, s: 1.1 },
      { x: -0.3, y: 1.8, z: 0.2, s: 0.65 },
      { x: 0.35, y: 1.6, z: -0.2, s: 0.55 },
    ];

    leafPositions.forEach((l) => {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(l.s, l.s, l.s), foliageMat);
      leaf.position.set(l.x, l.y, l.z);
      leaf.castShadow = true;
      treeGroup.add(leaf);
    });

    return treeGroup;
  }

  public update(deltaSec: number) {
    // Gentle floating island bobbing
    if (this.floatingIslands) {
      this.floatingIslands.children.forEach((island, i) => {
        const bob = Math.sin(Date.now() / 800 + i * 1.5) * 0.003;
        island.position.y += bob;
      });
    }
  }
}
