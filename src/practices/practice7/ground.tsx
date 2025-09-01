import { MeshReflectorMaterial } from "@react-three/drei";

export const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[25, 25]} />
      <MeshReflectorMaterial
        blur={[300, 100]} // 반사 블러 정도 (웅덩이 느낌)
        mixBlur={1} // 블러 섞임
        mixStrength={2} // 반사 강도
        roughness={1} // 표면 거칠기
        depthScale={0.25} // 반사 왜곡
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#707070" // 기본 바닥 색
        metalness={0.1} // 반사율
      />
    </mesh>
  );
};
