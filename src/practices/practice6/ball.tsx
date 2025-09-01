// Ball.tsx
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { Decal } from "@react-three/drei";

function useCircleAlpha(size = 256, feather = 0) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    // 배경: 완전 투명(알파 0)
    ctx.clearRect(0, 0, size, size);

    // 원형 알파(하드 엣지)
    const r = size * 0.5 * (1 - feather);
    ctx.fillStyle = "rgba(255,255,255,1)"; // 알파 1
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [size, feather]);
}

type BallProps = {
  ballRef: React.MutableRefObject<THREE.Mesh | null>;
  vel: React.MutableRefObject<number>;
  gravity: number;
  bounce: number;
  paused: boolean;
};

export const Ball = ({ ballRef, vel, gravity, bounce, paused }: BallProps) => {
  useLayoutEffect(() => {
    if (!ballRef.current) return;
    ballRef.current.position.set(0, 5, 0);
  }, []);

  useFrame(() => {
    if (!ballRef.current || paused) return;
    vel.current += gravity;
    ballRef.current.position.y += vel.current;
    if (
      ballRef.current.position.y < 1 &&
      Math.abs(ballRef.current.position.x) <= 12.75 &&
      Math.abs(ballRef.current.position.z) <= 12.75
    ) {
      ballRef.current.position.y = 1;
      vel.current *= -bounce;
    }
  });

  const circleAlpha = useCircleAlpha(256); // 한 번 생성해서 재사용
  return (
    <mesh ref={ballRef} castShadow>
      {/* 반지름 1 */}
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="skyblue" roughness={0.55} metalness={0.05} />

      {/* === 데칼: 회전이 확 보이도록 전/후면 표식 === */}

      {/* 뒷면 작은 점 3개(볼링홀 느낌) */}
      <Decal position={[0.23, 0.12, -0.99]} rotation={[0, Math.PI, 0]} scale={0.12}>
        <meshStandardMaterial
          color="#111"
          transparent
          alphaMap={circleAlpha}
          alphaTest={0.5}
          roughness={0.4}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-10}
          depthTest
          depthWrite={false}
        />
      </Decal>

      <Decal position={[-0.08, 0.22, -0.99]} rotation={[0, Math.PI, 0]} scale={0.1}>
        <meshStandardMaterial
          color="#111"
          transparent
          alphaMap={circleAlpha}
          alphaTest={0.5}
          roughness={0.4}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-10}
          depthTest
          depthWrite={false}
        />
      </Decal>

      <Decal position={[0.03, -0.05, -0.99]} rotation={[0, Math.PI, 0]} scale={0.1}>
        <meshStandardMaterial
          color="#111"
          transparent
          alphaMap={circleAlpha}
          alphaTest={0.5}
          roughness={0.4}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-10}
          depthTest
          depthWrite={false}
        />
      </Decal>
    </mesh>
  );
};
