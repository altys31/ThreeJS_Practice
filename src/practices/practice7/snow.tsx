import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export const Snow = ({ count = 4000, area = 60 }) => {
  const tRef = useRef(0);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * area;
      p[i * 3 + 1] = Math.random() * area * 0.8 + 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * area;
    }
    return p;
  }, [count, area]);

  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  useEffect(() => {
    const attr = new THREE.BufferAttribute(positions, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    geom.setAttribute("position", attr);
    geom.computeBoundingSphere();
  }, [geom, positions]);

  useEffect(() => {
    return () => {
      geom.dispose();
    };
  }, [geom]);

  useFrame((_, dt) => {
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const n = pos.count; // attribute에 맞춰 루프
    const t = (tRef.current += dt);

    for (let i = 0; i < n; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      // 좌우 흔들림
      arr[ix] += Math.sin(t + i) * 0.02;
      // 하강
      arr[iy] -= 1.5 * dt;
      if (arr[iy] < -area * 0.03) {
        arr[iy] = area * 0.17 + Math.random() * (area * 0.08);
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points geometry={geom}>
      <pointsMaterial size={0.06} sizeAttenuation />
    </points>
  );
};
