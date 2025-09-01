import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { MdOutlineReplay } from "react-icons/md";
import { Ball } from "./ball";
import * as THREE from "three";

export const Practice3 = () => {
  const ballRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(0); // 속도

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{ position: "absolute", left: "50%", top: "1%", cursor: "pointer", zIndex: "100" }}
        onClick={() => {
          if (ballRef.current) ballRef.current.position.y = 6; // ✅ 실제 위치 리셋
          velocity.current = 0;
        }}
      >
        <MdOutlineReplay size={24} />
      </div>
      <Canvas camera={{ position: [5, 3, 5] }}>
        <gridHelper args={[24, 24, "#444", "#222"]} />
        <ambientLight intensity={0.88} />
        <directionalLight position={[0, 0, 0]} intensity={1} />
        <Ball ballRef={ballRef} velocity={velocity} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
