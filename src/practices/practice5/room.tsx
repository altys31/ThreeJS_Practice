import { MeshReflectorMaterial } from "@react-three/drei";

export const Room = () => {
  return (
    <group>
      {/*바닥*/}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // 반사 블러 정도 (웅덩이 느낌)
          mixBlur={0.5} // 블러 섞임
          mixStrength={10} // 반사 강도
          roughness={0} // 표면 거칠기
          depthScale={0.25} // 반사 왜곡
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#fdffdc" // 기본 바닥 색
          metalness={0} // 반사율
        />
      </mesh>
      {/*천장*/}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 25, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // 반사 블러 정도 (웅덩이 느낌)
          mixBlur={0.5} // 블러 섞임
          mixStrength={10} // 반사 강도
          roughness={0} // 표면 거칠기
          depthScale={0.25} // 반사 왜곡
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#fdffdc" // 기본 바닥 색
          metalness={0} // 반사율
        />
      </mesh>
      <mesh position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[50, 50, 64, 64]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // 반사 블러 정도 (웅덩이 느낌)
          mixBlur={0.5} // 블러 섞임
          mixStrength={10} // 반사 강도
          roughness={0} // 표면 거칠기
          depthScale={0.25} // 반사 왜곡
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#fdffdc" // 기본 바닥 색
          metalness={0} // 반사율
        />
      </mesh>
      {/*뒷벽*/}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, 50]} receiveShadow>
        <planeGeometry args={[100, 50, 64, 64]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // 반사 블러 정도 (웅덩이 느낌)
          mixBlur={0.5} // 블러 섞임
          mixStrength={10} // 반사 강도
          roughness={0} // 표면 거칠기
          depthScale={0.25} // 반사 왜곡
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#fdffdc" // 기본 바닥 색
          metalness={0} // 반사율
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, 0]} position={[-18, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 50, 64, 64]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // 반사 블러 정도 (웅덩이 느낌)
          mixBlur={0.5} // 블러 섞임
          mixStrength={10} // 반사 강도
          roughness={0} // 표면 거칠기
          depthScale={0.25} // 반사 왜곡
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#fdffdc" // 기본 바닥 색
          metalness={0} // 반사율
        />
      </mesh>

      <mesh rotation={[0, (Math.PI / 3) * -1, 0]} position={[20, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 50, 64, 64]} />
        <MeshReflectorMaterial
          blur={[0, 0]} // 반사 블러 정도 (웅덩이 느낌)
          mixBlur={0.5} // 블러 섞임
          mixStrength={10} // 반사 강도
          roughness={0} // 표면 거칠기
          depthScale={0.25} // 반사 왜곡
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#fdffdc" // 기본 바닥 색
          metalness={0} // 반사율
        />
      </mesh>
    </group>
  );
};
