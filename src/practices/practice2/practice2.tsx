import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// 토러스(도넛) Mesh 컴포넌트
function SpinningTorus() {
  const ref = useRef<THREE.Mesh>(null!);

  // 매 프레임마다 실행되는 훅
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref}>
      {/* TorusGeometry: 반지름, 튜브두께, 분할수 */}
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}

export default function Practice2() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [3, 3, 3] }}>
        {/* 조명들 */}
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />

        {/* 오브젝트 */}
        <SpinningTorus />

        {/* 마우스로 회전/줌 컨트롤 */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
