import { CameraControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Practice9 = () => {
  const BearToHoney = () => {
    const textureA = useLoader(THREE.TextureLoader, "icon_16.png");
    const textureB = useLoader(THREE.TextureLoader, "icon_17.webp");

    const vecA = new THREE.Vector3(-2, 2, 0);
    const vecB = new THREE.Vector3(2, 0, 0);

    const textureRef = useRef<THREE.Sprite>(null);

    useFrame((_, delta) => {
      const textureAObj = textureRef.current;
      if (textureAObj) {
        textureAObj.position.x += vecB.clone().sub(vecA).normalize().x * delta;
        textureAObj.position.y += vecB.clone().sub(vecA).normalize().y * delta;
      }
    });

    return (
      <>
        <sprite ref={textureRef} position={vecA}>
          <spriteMaterial map={textureA} />
        </sprite>
        <sprite position={vecB}>
          <spriteMaterial map={textureB} />
        </sprite>
      </>
    );
  };

  return (
    <Canvas>
      <ambientLight intensity={5} />
      <directionalLight position={[5, 5, 5]} />
      <BearToHoney />
      <CameraControls />
      <axesHelper args={[7]} />
      <gridHelper rotation={[THREE.MathUtils.degToRad(90), 0, 0]} args={[100, 100, "red"]} />
    </Canvas>
  );
};
