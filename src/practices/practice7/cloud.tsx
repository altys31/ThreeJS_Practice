import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export const Clouds = ({ count = 12, area = 60, speed = 0.5 }) => {
  const group = useRef<THREE.Group>(null!);
  const textures = useMemo(() => new THREE.TextureLoader().load("/cloud_soft.png"), []);
  const items = useMemo(
    () =>
      [...Array(count)].map(() => ({
        x: (Math.random() - 0.5) * area,
        y: 15 + Math.random() * 5,
        z: (Math.random() - 0.5) * area,
        s: 10 + Math.random() * 12,
      })),
    [count, area]
  );

  useFrame((_, dt) => {
    group.current.children.forEach((m) => {
      m.position.x += speed * dt;
      if (m.position.x > area * 0.5) m.position.x = -area * 0.5;
    });
  });

  return (
    <group ref={group}>
      {items.map((c, i) => (
        <sprite key={i} position={[c.x, c.y, c.z]} scale={[c.s, c.s, 1]}>
          <spriteMaterial map={textures} depthWrite={false} transparent opacity={0.5} />
        </sprite>
      ))}
    </group>
  );
};
