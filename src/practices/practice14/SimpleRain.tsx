import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SimpleRainProps {
  count?: number;
  onHit?: (x: number, z: number) => void;
}

export const SimpleRain = ({ count = 100, onHit }: SimpleRainProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10; // x
      pos[i * 3 + 1] = Math.random() * 5 + 2; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let y = pos.getY(i) - 3 * delta; // 낙하 속도

      // 바닥 충돌
      if (y < 0) {
        if (onHit) onHit(x, z);
        y = 5 + Math.random() * 2; // 재생성
      }

      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="white" transparent opacity={0.6} />
    </points>
  );
};
