import { Canvas } from "@react-three/fiber";
import { Ball } from "./ball";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Ground } from "./ground";
import { useControls } from "leva";
import { MdOutlineReplay } from "react-icons/md";
import { OrbitControls, Sky } from "@react-three/drei";
import * as THREE from "three";
import { WASDController } from "./controller";

export const Practice6 = () => {
  const ballRef = useRef<THREE.Mesh>(null!);
  const velocity = useRef(0); // (기존) 수직 속도
  const hVel = useRef(new THREE.Vector3()); // ★ 추가: 수평 속도
  const sunRef = useRef<THREE.DirectionalLight>(null);

  const { gravity, bounce, paused, sunAzimuth, sunElevation } = useControls({
    gravity: { value: -0.0025, min: -0.02, max: 0, step: 0.0005 },
    bounce: { value: 0.8, min: 0, max: 1, step: 0.01 },
    paused: false,
    sunAzimuth: { label: "태양 방위각", value: 50, min: 0, max: 360, step: 1 },
    sunElevation: { label: "태양 고도", value: 45, min: 0, max: 89, step: 1 },
  });

  const sunPos = useMemo<[number, number, number]>(() => {
    const r = 25;
    const el = THREE.MathUtils.degToRad(sunElevation);
    const az = THREE.MathUtils.degToRad(sunAzimuth);
    const y = Math.sin(el) * r;
    const h = Math.cos(el) * r;
    const x = Math.sin(az) * h;
    const z = Math.cos(az) * h;
    return [x, y, z];
  }, [sunAzimuth, sunElevation]);

  const lightInt = useMemo<number>(() => (sunElevation / 90) * 2 + 0.1, [sunElevation]);

  useEffect(() => {
    if (!sunRef.current) return;
    sunRef.current.target.position.set(0, 0, 0);
    sunRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", background: "#feffe2" }}>
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          cursor: "pointer",
          paddingTop: "0.5rem",
          justifyContent: "center",
          zIndex: 110,
        }}
        onClick={() => {
          const m = (ballRef as RefObject<THREE.Mesh>).current;
          if (!m) return;
          // 위치/속도/회전 리셋
          m.position.set(0, 6, 0);
          velocity.current = 0; // 수직속도(기존)
          hVel.current.set(0, 0, 0); // ★ 수평속도
          m.quaternion.identity(); // ★ 회전 초기화(굴림 자취 초기화)
        }}
        title="Reset (R)"
      >
        <MdOutlineReplay size={24} />
      </div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          top: "24px",
          justifyContent: "center",
          color: "black",
          fontSize: "12px",
          paddingTop: "1rem",
          fontWeight: "600",
          zIndex: "100",
        }}
      >
        Press W,A,S,D to roll!
      </div>

      <Canvas shadows camera={{ position: [5, 3, 5], fov: 80 }}>
        <Sky
          sunPosition={sunPos}
          distance={450000}
          turbidity={4}
          rayleigh={1.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.9}
          inclination={0}
          azimuth={0}
        />
        <ambientLight intensity={0.25} />
        <directionalLight
          ref={sunRef}
          position={sunPos}
          intensity={lightInt}
          castShadow
          shadow-bias={-0.0005}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <Ground />
        <gridHelper args={[24, 24, "#444", "#222"]} />

        {/* 공: 기존 중력/바운스 로직 그대로 */}
        <Ball ballRef={ballRef} vel={velocity} gravity={gravity} bounce={bounce} paused={paused} />

        {/* ★ WASD 컨트롤러: 카메라 기준 XZ 이동 + 회전 */}
        <WASDController ballRef={ballRef} hVel={hVel} paused={paused} radius={0.5} />

        <OrbitControls />
      </Canvas>
    </div>
  );
};
