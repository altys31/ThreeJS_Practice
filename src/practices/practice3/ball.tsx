import { useFrame } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";

type BallProps = {
  ballRef: React.MutableRefObject<THREE.Mesh | null>;
  velocity: React.MutableRefObject<number>;
};

export const Ball = ({ ballRef, velocity }: BallProps) => {
  const gravity = -0.003; // 중력 가속도

  useLayoutEffect(() => {
    if (!ballRef.current) return; // ✅ null 가드
    ballRef.current.position.set(0, 6, 0); // 마운트 후 1회 초기화
  }, []);

  useFrame(() => {
    if (!ballRef.current) return;
    velocity.current += gravity; // 가속도 적용
    ballRef.current.position.y += velocity.current;

    // 땅에 닿으면 반발 처리
    if (ballRef.current.position.y < 1) {
      ballRef.current.position.y = 1;
      velocity.current *= -0.8; // 튕김 (마찰계수 적용)
    }
  });

  return (
    <mesh ref={ballRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
};
