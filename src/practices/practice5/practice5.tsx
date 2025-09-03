import { KeyboardControls, PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RawPositionalAudio } from "./sound";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib"; // drei 내부 의존성
import { Room } from "./room";

function FPCamera() {
  const ref = useRef<PointerLockControlsImpl>(null!);
  const [, get] = useKeyboardControls();

  useFrame((_, delta) => {
    if (!ref.current?.isLocked) return;
    const { forward, backward, left, right, sprint } = get();
    const speed = (sprint ? 10 : 6) * delta;

    const front = Number(backward) - Number(forward);
    const side = Number(right) - Number(left);

    if (front) ref.current.moveForward(front * speed * -1); // 수평 앞/뒤
    if (side) ref.current.moveRight(side * speed); // 수평 좌/우
  });

  return <PointerLockControls ref={ref} />;
}

const NarrowSpotLight = () => {
  const lightRef = useRef<THREE.SpotLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);

  // 스포트라이트(좁은 빔) 설정
  // angle: 빔의 반각, penumbra: 가장자리 부드러움, distance/decay: 감쇠
  useEffect(() => {
    if (!lightRef.current || !targetRef.current) return;
    lightRef.current.target = targetRef.current;
  }, []);

  // 스포트라이트를 천장 쪽에서 바닥 중앙으로 쏘고, 살짝 흔들리게
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!lightRef.current || !targetRef.current) return;
    lightRef.current.position.set(Math.sin(t * 0.4) * 5.0, 5.0, Math.cos(t * 0.3) * 3);
    targetRef.current.position.set(0, 0, 0); // 바닥 중앙을 조준
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        castShadow
        color={"#ffffff"}
        intensity={10.0} // 밝기
        angle={Math.PI / 2} // 좁은 빔(작게 할수록 더 좁음)
        penumbra={1} // 가장자리 부드러움
        distance={15} // 도달 거리
        decay={0.25} // 감쇠(물리적 감쇠 느낌)
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* 스포트라이트가 바라볼 타겟 오브젝트 (움직이는 포인터 느낌) */}
      <object3D ref={targetRef} position={[0, 0, 0]} />
    </>
  );
};

export const Practice5 = () => {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["KeyW", "ArrowUp"] },
        { name: "backward", keys: ["KeyS", "ArrowDown"] },
        { name: "left", keys: ["KeyA", "ArrowLeft"] },
        { name: "right", keys: ["KeyD", "ArrowRight"] },
        { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
      ]}
    >
      <div
        tabIndex={0}
        style={{
          width: "100%",
          height: "100%",
          outline: "none",
          background: "#4f503e",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "100%",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            paddingTop: "1rem",
            fontWeight: "600",
            zIndex: "100",
          }}
        >
          Press W,A,S,D to move!
        </div>

        <Canvas camera={{ position: [0, 3, 35] }} dpr={[1, 2]} shadows>
          <FPCamera />
          <gridHelper args={[100, 100, "#444", "#222"]} />
          <Room />
          {/* <Hall /> */}
          <shadowMaterial opacity={0.3} />
          <ambientLight intensity={0.33} />
          <NarrowSpotLight />
          <RawPositionalAudio position={[0, 0.2, 0]} />
        </Canvas>
      </div>
    </KeyboardControls>
  );
};
