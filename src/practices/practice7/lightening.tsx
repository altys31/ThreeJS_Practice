import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Lightening = ({
  chance = 0.001,
  onRayleighChange,
}: {
  chance: number;
  onRayleighChange: (v: number) => void;
}) => {
  const light = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    if (Math.random() < chance) {
      light.current.intensity = 0;
      // 몇 번의 플래시
      setTimeout(() => {
        light.current.intensity = 8;
        onRayleighChange(0.1);
      }, 35);
      setTimeout(() => {
        light.current.intensity = 0.5;
        onRayleighChange(0.02);
      }, 100);
      setTimeout(() => {
        light.current.intensity = 0;
        onRayleighChange(0);
      }, 200);
    }
  });
  return <pointLight ref={light} position={[0, 20, 0]} intensity={0} distance={50} decay={0.2} />;
};
