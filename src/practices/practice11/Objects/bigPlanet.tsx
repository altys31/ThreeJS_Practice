import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ConvexGeometry } from "three/addons/geometries/ConvexGeometry.js";

export const BigPlanet = ({ position, size }: { position: THREE.Vector3; size: number }) => {
  // shooting star 구현 예정

  const meshRef = useRef<THREE.Mesh | null>(null);
  const COLOR = ["#fffd84"];
  const baseHex = COLOR[THREE.MathUtils.randInt(0, COLOR.length - 1)];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.05;
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  const { geometry, material } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const safeSize = Math.max(0.01, size);
    const pointCount = 5000; // 더 많이 하면 더 둥글게
    let attempts = 0;
    const maxAttempts = pointCount * 6;

    while (pts.length < pointCount && attempts < maxAttempts) {
      attempts++;
      // 가우시안 표본을 이용해 방향을 얻음 (균등 분포 방향)
      const dir = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1)
      );
      if (dir.lengthSq() < 1e-8) continue;
      dir.normalize();

      // 반경에 약간 분포를 줘서 내부/외부로 퍼지게 함 (0.75 ~ 1.15)
      const radius = safeSize * THREE.MathUtils.randFloat(1, 1.15);

      // 미세한 위치 잡음(jitter)로 수치적 퇴화 방지
      const jitter = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(safeSize * 0.02),
        THREE.MathUtils.randFloatSpread(safeSize * 0.02),
        THREE.MathUtils.randFloatSpread(safeSize * 0.02)
      );

      const p = dir.clone().multiplyScalar(radius).add(jitter);
      if (p.lengthSq() < 1e-8) continue;
      pts.push(p);
    }

    // Convex 생성 시 실패 가능성 대비 폴백
    let geom: THREE.BufferGeometry;
    try {
      geom = new ConvexGeometry(pts);
    } catch (err) {
      console.warn("ConvexGeometry failed, fallback to Icosahedron", err);
      geom = new THREE.IcosahedronGeometry(safeSize, 1);
    }

    const nonIndexed = geom.index ? geom.toNonIndexed() : geom.clone();
    const posAttr = nonIndexed.getAttribute("position") as THREE.BufferAttribute;
    const vertexCount = posAttr.count;
    const colors = new Float32Array(vertexCount * 3);
    const baseColor = new THREE.Color(baseHex);
    const lightDir = new THREE.Vector3(1, 0.6, 0.2).normalize();

    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();
    const e1 = new THREE.Vector3();
    const e2 = new THREE.Vector3();
    const faceNormal = new THREE.Vector3();
    const tempColor = new THREE.Color();

    for (let i = 0; i < vertexCount; i += 3) {
      pA.fromBufferAttribute(posAttr, i);
      pB.fromBufferAttribute(posAttr, i + 1);
      pC.fromBufferAttribute(posAttr, i + 2);

      e1.subVectors(pB, pA);
      e2.subVectors(pC, pA);
      faceNormal.crossVectors(e1, e2).normalize();

      const ndl = Math.max(0, faceNormal.dot(lightDir));
      const shade = 0.35 + 0.65 * ndl;

      tempColor.copy(baseColor).multiplyScalar(shade);
      const hueShift = THREE.MathUtils.randFloatSpread(0.02);
      tempColor.offsetHSL(
        hueShift,
        THREE.MathUtils.randFloatSpread(0.06),
        THREE.MathUtils.randFloatSpread(0.04)
      );

      colors[(i + 0) * 3 + 0] = tempColor.r;
      colors[(i + 0) * 3 + 1] = tempColor.g;
      colors[(i + 0) * 3 + 2] = tempColor.b;

      colors[(i + 1) * 3 + 0] = tempColor.r;
      colors[(i + 1) * 3 + 1] = tempColor.g;
      colors[(i + 1) * 3 + 2] = tempColor.b;

      colors[(i + 2) * 3 + 0] = tempColor.r;
      colors[(i + 2) * 3 + 1] = tempColor.g;
      colors[(i + 2) * 3 + 2] = tempColor.b;
    }

    nonIndexed.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.MeshNormalMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
    });

    // 원본 geom과 nonIndexed가 다르면 원본 해제(메모리 누수 방지)
    if (nonIndexed !== geom) geom.dispose();

    return { geometry: nonIndexed, material: mat };
  }, [size, baseHex]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <mesh position={position} geometry={geometry} material={material} ref={meshRef}></mesh>;
};
