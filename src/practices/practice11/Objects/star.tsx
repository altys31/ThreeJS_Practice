import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface PropsType {
  position: THREE.Vector3;
  size: number;
}

export const Star = ({ position, size }: PropsType) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const COLOR = [
    "#88beff",
    "#e9ceff",
    "white",
    "#f9d397",
    "#ff9a9a",
    "#ffffac",
    "#b7d7ff",
    "#f0f001",
    "#5c74ff",
    "#833737",
    "#dbff97",
  ];
  const colorIndex = THREE.MathUtils.randInt(0, COLOR.length);
  const Y_AXIS = new THREE.Vector3(0, 1, 0);
  const DIST_LIMIT = 10000;
  const freqShine = THREE.MathUtils.randFloat(1, 30);

  useFrame((state, delta) => {
    const pos = meshRef.current.position.applyAxisAngle(Y_AXIS, delta / 100);
    const dist = state.camera.position.distanceTo(meshRef.current.position);

    if (dist > DIST_LIMIT)
      meshRef.current.scale.set(dist / DIST_LIMIT, dist / DIST_LIMIT, dist / DIST_LIMIT);
    meshRef.current.position.x = pos.x;
    meshRef.current.position.y = pos.y;
    meshRef.current.position.z = pos.z;

    if (
      state.clock.getElapsedTime() % 30 > freqShine &&
      state.clock.getElapsedTime() % 30 < freqShine + 0.25
    ) {
      const tw = size * Math.sin(Math.PI * ((state.clock.getElapsedTime() % 0.5) / 0.5) * 0.00175);
      meshRef.current.scale.set(size * tw, size * tw, size * tw);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 16]} />
      <meshStandardMaterial color={COLOR[colorIndex]} />
    </mesh>
  );
};
