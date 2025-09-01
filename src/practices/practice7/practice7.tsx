import { Environment, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";
import { FogLayer } from "./fog";
import { Ground } from "./ground";
import { Rain } from "./rain";
import { Snow } from "./snow";
import { Clouds } from "./cloud";
import { Lightening } from "./lightening";
import { useState } from "react";

const Scene = () => {
  const [rayleigh, setRayleigh] = useState(0);

  const { turbidity, rainSwitch, snowSwitch, cloudSwitch, lighteningSwitch } = useControls({
    turbidity: { value: 1, min: 1, max: 20, step: 0.1, label: "대기 탁도" },
    rainSwitch: { value: true, label: "비 내림" },
    snowSwitch: { value: false, label: "눈 내림" },
    cloudSwitch: { value: true, label: "구름" },
    lighteningSwitch: { value: false, label: "번개" },
  });

  // drei/Sky는 (azimuth, elevation)으로 태양 위치를 결정
  return (
    <>
      <Sky
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={0.001}
        mieDirectionalG={0.2}
        distance={450000}
      />
      <FogLayer />
      <Environment background={false} preset="sunset" />
      {rainSwitch && <Rain />}
      {cloudSwitch && <Clouds />}
      <Ground />
      {lighteningSwitch && <Lightening chance={0.00125} onRayleighChange={setRayleigh} />}
      {snowSwitch && <Snow />}
      <directionalLight
        position={azElToVec3(50, 45).multiplyScalar(100)}
        intensity={1.2}
        castShadow
      />
    </>
  );
};

const azElToVec3 = (azimuthDeg: number, elevationDeg: number) => {
  const az = THREE.MathUtils.degToRad(azimuthDeg);
  const el = THREE.MathUtils.degToRad(elevationDeg);
  const x = Math.sin(az) * Math.cos(el);
  const y = Math.sin(el);
  const z = Math.cos(az) * Math.cos(el);
  return new THREE.Vector3(x, y, z);
};

export const Practice7 = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas shadows camera={{ position: [12, 2, 12], fov: 50 }}>
        <Scene />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
