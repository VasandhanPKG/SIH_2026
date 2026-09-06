import * as THREE from "three";
import { ROUTE_B_3D_PATH, ROUTE_A_3D_PATH } from "@/lib/simulatorConfig";

export class SafeRouteVisuals {
  public group: THREE.Group;
  public safeRouteLine: THREE.Line;
  public rejectedRouteLine: THREE.Line;
  public chevronsGroup: THREE.Group;
  private safeMat: THREE.LineBasicMaterial;
  private rejectMat: THREE.LineBasicMaterial;

  constructor() {
    this.group = new THREE.Group();

    // 1. Safe Route B (Cyan / Emerald Glowing Line)
    const safePoints = ROUTE_B_3D_PATH.map((p) => new THREE.Vector3(p.x, p.y + 0.1, p.z));
    const safeCurve = new THREE.CatmullRomCurve3(safePoints);
    const safeGeom = new THREE.BufferGeometry().setFromPoints(safeCurve.getPoints(80));

    this.safeMat = new THREE.LineBasicMaterial({
      color: 0x10b981, // Emerald green
      linewidth: 4,
      transparent: true,
      opacity: 0.0,
    });
    this.safeRouteLine = new THREE.Line(safeGeom, this.safeMat);
    this.group.add(this.safeRouteLine);

    // 2. Animated Chevrons along Route B
    this.chevronsGroup = new THREE.Group();
    const chevronPoints = safeCurve.getPoints(12);
    const chevronMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.0 });

    chevronPoints.forEach((pt, i) => {
      if (i > 0 && i < chevronPoints.length - 1) {
        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 4), chevronMat);
        arrow.position.set(pt.x, 0.15, pt.z);
        arrow.rotation.x = Math.PI / 2;
        this.chevronsGroup.add(arrow);
      }
    });
    this.group.add(this.chevronsGroup);

    // 3. Rejected Hazardous Route A (Red Line)
    const rejectPoints = ROUTE_A_3D_PATH.map((p) => new THREE.Vector3(p.x, p.y + 0.1, p.z));
    const rejectCurve = new THREE.CatmullRomCurve3(rejectPoints);
    const rejectGeom = new THREE.BufferGeometry().setFromPoints(rejectCurve.getPoints(50));

    this.rejectMat = new THREE.LineBasicMaterial({
      color: 0xef4444, // Red
      linewidth: 2,
      transparent: true,
      opacity: 0.0,
    });
    this.rejectedRouteLine = new THREE.Line(rejectGeom, this.rejectMat);
    this.group.add(this.rejectedRouteLine);
  }

  public update(isSafeRouteVisible: boolean, isRouteRejectedVisible: boolean) {
    if (isSafeRouteVisible) {
      const pulse = 0.65 + Math.sin(Date.now() / 200) * 0.25;
      this.safeMat.opacity = pulse;
      this.chevronsGroup.children.forEach((child, idx) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 + Math.sin(Date.now() / 150 + idx) * 0.4;
      });
    } else {
      this.safeMat.opacity = 0.0;
      this.chevronsGroup.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.0;
      });
    }

    if (isRouteRejectedVisible) {
      this.rejectMat.opacity = 0.35;
    } else {
      this.rejectMat.opacity = 0.0;
    }
  }
}
