import { ConvexGeometry } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useEffect, useMemo } from "react";

export const ConObj = ({ size }: { size: number; position: THREE.Vector3 }) => {
  const points: THREE.Vector3[] = [];

  const COLOR = [
    "#88beff",
    "white",
    "#f9d397",
    "#fd6b6b",
    "#ffffac",
    "#b7d7ff",
    "#f0f001",
    "#5c74ff",
    "#833737",
    "#dbff97",
  ];

  for (let i = 0; i < 10; i++) {
    points.push(
      new THREE.Vector3(
        THREE.MathUtils.randFloat(0, 1) * size,
        THREE.MathUtils.randFloat(0, 1) * size,
        THREE.MathUtils.randFloat(0, 1) * size
      )
    );
  }

  const geometry = useMemo(() => {
    const g = new ConvexGeometry(points);
    const nonIndexed = g.index ? g.toNonIndexed() : g;

    const pos = nonIndexed.getAttribute("position") as THREE.BufferAttribute;
    const vertexCount = pos.count;
    const colors = new Float32Array(vertexCount * 3);

    const color = new THREE.Color();
    for (let i = 0; i < vertexCount; i += 3) {
      // hex Int로 변환
      color.setHex(Number(COLOR[THREE.MathUtils.randInt(0, COLOR.length - 1)]));

      /*
      for (let v = 0; v < 3; v++) {
        const idx = (i + v) * 3;
        colors[idx + 0] = color.r;
        colors[idx + 1] = color.g;
        colors[idx + 2] = color.b;
      }
      */
    }
    nonIndexed.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return nonIndexed;
  }, [points]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <>
      <mesh geometry={geometry} material={material}></mesh>
    </>
  );
};
