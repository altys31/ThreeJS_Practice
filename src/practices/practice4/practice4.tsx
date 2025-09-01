import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface InstancedMeshWithColor extends THREE.InstancedMesh {
  instanceColor: THREE.InstancedBufferAttribute | null;
}

function InstancedSpheres3DGrid() {
  // === 격자 설정 ===
  const N = 10; // 한 변의 개수 → 총 N^3 개
  const radius = 0.1; // 구 반지름
  const count = N * N * N;

  const meshRef = useRef<InstancedMeshWithColor>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);

  // 초기 좌표를 보관(애니메이션의 기준점)
  const basePositions = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // instanceColor 준비
    if (!mesh.instanceColor || mesh.instanceColor.count !== count) {
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    }

    // 초기 배치: -range~+range 랜덤
    const range = 3;
    for (let id = 0; id < count; id++) {
      const x = (Math.random() * 2 - 1) * range;
      const y = (Math.random() * 2 - 1) * range + 5;
      const z = (Math.random() * 2 - 1) * range;

      // 기준 좌표 저장
      const i3 = id * 3;
      basePositions.current[i3 + 0] = x;
      basePositions.current[i3 + 1] = y;
      basePositions.current[i3 + 2] = z;

      // 행렬 세팅
      dummy.position.set(x, y, z);
      dummy.quaternion.set(0, 0, 0, 1);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(id, dummy.matrix);

      // 인스턴스 색상(HSL → RGB)
      const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
      mesh.setColorAt(id, color);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  }, [count, dummy]);

  // 매 프레임 y만 진동시키기(방법 3 컨셉: 기존 좌표 기반으로 갱신)
  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.getElapsedTime();
    const amp = 0.3; // 진폭
    const speed = 1.2; // 속도
    const phase = 0.15; // 개체별 위상 차이

    for (let id = 0; id < count; id++) {
      // 기준 좌표 읽기
      const i3 = id * 3;
      const bx = basePositions.current[i3 + 0];
      const by = basePositions.current[i3 + 1];
      const bz = basePositions.current[i3 + 2];

      // y만 변형 (기준값 by에 +sin)
      const y = by + Math.sin(t * speed + id * phase) * amp;

      // 현재 행렬 가져오고 위치 업데이트(방법 3 스타일)
      mesh.getMatrixAt(id, tempMatrix);
      tempPos.set(bx, y, bz);

      dummy.position.copy(tempPos);
      // 기존 회전/스케일 유지하고 싶으면 tempMatrix에서 추출해서 복사해도 됨
      dummy.quaternion.set(0, 0, 0, 1);
      dummy.scale.set(1, 1, 1);

      dummy.updateMatrix();
      mesh.setMatrixAt(id, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true; // GPU에 행렬 업데이트 반영
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[radius, 12, 12]} />
      {/* 인스턴스 색 반영 */}
      <meshStandardMaterial color="#fff" />
    </instancedMesh>
  );
}

export const Practice4 = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [12, 3, 0], fov: 90 }} dpr={[1, 2]}>
        <ambientLight intensity={0.88} />
        <directionalLight position={[6, 7, 9]} intensity={1} />
        <gridHelper args={[24, 24, "#444", "#222"]} />
        <InstancedSpheres3DGrid />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
