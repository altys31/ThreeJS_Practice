import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { RippleGround } from "./shader/RippleGround";
import { SimpleRain } from "./SimpleRain";

export const Practice14 = () => {
  const [ripples, setRipples] = useState<Array<{ x: number; z: number; time: number }>>([]);

  const addRipple = (x: number, z: number) => {
    setRipples((prev) => [...prev, { x, z, time: 0 }]);
  };

  return (
    <Canvas camera={{ position: [0, 3, 5], fov: 60 }} gl={{ antialias: true }}>
      <color attach="background" args={["#1a1a2e"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      <RippleGround ripples={ripples} setRipples={setRipples} />
      <SimpleRain count={200} onHit={addRipple} />

      <OrbitControls />
    </Canvas>
  );
};
