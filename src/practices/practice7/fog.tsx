import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export const FogLayer = ({ density = 0.015, color = "#bcd1e3" }) => {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.fog = new THREE.FogExp2(color, density); // 비 올 때는 density ↑
    return () => {
      scene.fog = null;
    };
  }, [scene, color, density]);
  return null;
};
