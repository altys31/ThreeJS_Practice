import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import vertexShader from "./vertexShader.glsl?raw";
import fragmentShader from "./fragmentShader.glsl?raw";

interface Ripple {
  x: number;
  z: number;
  time: number;
}

interface RippleGroundProps {
  ripples: Ripple[];
  setRipples: React.Dispatch<React.SetStateAction<Ripple[]>>;
  onClick?: (e: THREE.Event) => void;
}

export const RippleGround = ({ ripples, setRipples, onClick }: RippleGroundProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRipples: { value: Array.from({ length: 10 }, () => new THREE.Vector3(0, 0, 0)) },
      uRippleCount: { value: 0 },
      cameraPosition: { value: camera.position },
    }),
    [camera]
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.cameraPosition.value.copy(state.camera.position);

    setRipples((prev) => {
      const updated = prev.map((r) => ({ ...r, time: r.time + delta }));
      return updated.filter((r) => r.time < 2.5); // 2.5초로 증가
    });

    ripples.forEach((r, i) => {
      if (i < 10) {
        uniforms.uRipples.value[i].set(r.x, r.z, r.time);
      }
    });
    uniforms.uRippleCount.value = Math.min(ripples.length, 10);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
      <planeGeometry args={[10, 10, 128, 128]} /> {/* ← 더 세밀하게 */}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
