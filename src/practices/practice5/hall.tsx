import { useGLTF } from "@react-three/drei";

export const Hall = () => {
  const { scene } = useGLTF("./hall.glb"); // glb 파일 경로

  return <primitive object={scene} />;
};
