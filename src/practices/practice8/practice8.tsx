import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export const Practice8 = () => {
  const vecA = new THREE.Vector3(3, 4, 0);
  const vecB = new THREE.Vector3(-4, 3, 0);
  const vecC = new THREE.Vector3().addVectors(vecA, vecB);
  const vecD = vecA.clone().sub(vecB);
  const origin = new THREE.Vector3(0, 0, 0);
  const ditA = origin.distanceTo(vecA);
  const ditB = origin.distanceTo(vecB);
  const ditC = origin.distanceTo(vecC);
  const ditD = origin.distanceTo(vecD);

  const Box = ({ vec }: { vec: THREE.Vector3 }) => {
    return (
      <mesh
        position={vec}
        rotation={[THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(45), 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="orange" opacity={0.5} transparent />
      </mesh>
    );
  };

  return (
    <Canvas orthographic camera={{ zoom: 50 }}>
      <arrowHelper args={[vecA.clone().normalize(), origin, ditA, "blue"]} />
      <CameraControls />
      <directionalLight position={[5, 5, 5]} />
      <ambientLight intensity={0.5} />
      <axesHelper args={[7]} />
      <gridHelper rotation={[THREE.MathUtils.degToRad(90), 0, 0]} args={[100, 100, "red"]} />
      <Box vec={vecA} />
      <Box vec={vecB} />
      <arrowHelper args={[vecB.clone().normalize(), origin, ditB, "blue"]} />
      <arrowHelper args={[vecC.clone().normalize(), origin, ditC, "green"]} />
      <arrowHelper args={[vecD.clone().normalize(), origin, ditD, "purple"]} />
    </Canvas>
  );
};
