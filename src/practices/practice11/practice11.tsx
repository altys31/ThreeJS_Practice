import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Star } from "./Objects/star";
import { useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/controls/OrbitControls";
import { Planet } from "./Objects/planet";
import { BigPlanet } from "./Objects/bigPlanet";

export const Practice11 = ({ isDebug }: { isDebug: boolean }) => {
  const controlsRef = useRef<OrbitControlsType>(null);

  const AutoZoomOut = ({
    speed = -10,
    controlsRef,
  }: {
    speed?: number;
    controlsRef?: OrbitControlsType;
  }) => {
    const { camera } = useThree();
    const dir = useRef(new THREE.Vector3());
    const minDist = 3000; // 카메라가 이 거리 안으로 들어가지 않게 함
    const eps = 1e-6;
    let acceleration = 50;
    let reachedEnd = false;

    useFrame((_, delta) => {
      const len = camera.position.length();

      // 지수적으로 상승하는 속도
      acceleration *= 1.01;
      speed -= 150 + acceleration++; // 시간이 지남에 따라 점점 더 빨라짐
      if (!isFinite(len) || len <= minDist + eps) {
        reachedEnd = true;
        return; // 안전 체크
      }

      if (reachedEnd) return;
      dir.current.copy(camera.position).normalize();
      const desiredMove = speed * delta;
      const maxAllowedMove = Math.max(0, len - minDist);
      const move = Math.min(desiredMove, maxAllowedMove);

      camera.position.addScaledVector(dir.current, move);
      controlsRef?.current?.update?.();
    });

    return null;
  };

  const genBackgroundStars = () => {
    const stars = [];
    for (let i = 0; i < 7500; i++) {
      const size = [15, 10, 15, 25, 7, 20][THREE.MathUtils.randInt(0, 5)];
      const pos = new THREE.Vector3(
        THREE.MathUtils.randInt(-150000, 150000),
        THREE.MathUtils.randInt(-150000, 150000),
        THREE.MathUtils.randInt(-150000, 150000)
      );
      stars.push(<Star key={i} position={pos} size={size} />);
    }
    return stars;
  };

  const genBackgroundPlanets = () => {
    const planets = [];
    for (let i = 0; i < 200; i++) {
      const size = [200, 300, 400, 2000, 500][THREE.MathUtils.randInt(0, 4)];
      const pos = new THREE.Vector3(
        THREE.MathUtils.randInt(-100000, 120000),
        THREE.MathUtils.randInt(-100000, 120000),
        THREE.MathUtils.randInt(-100000, 120000)
      );
      planets.push(<Planet key={i} position={pos} size={size} />);
    }
    return planets;
  };

  const genShootingStars = () => {
    const shootingStars = [];
    for (let i = 0; i < 1; i++) {
      const size = 20000;
      const pos = new THREE.Vector3(30000, 30000, 30000);
      shootingStars.push(<BigPlanet key={i} position={pos} size={size} />);
    }
    return shootingStars;
  };

  return (
    <Canvas
      camera={{
        near: 1,
        position: [-140000, -140000, -140000],
        rotation: [0, 0, 0],
        far: 100000,
      }}
    >
      <AutoZoomOut speed={-10} controlsRef={controlsRef} />
      <color attach="background" args={["#111111"]} />
      <ambientLight color={"#fff"} intensity={5} />
      {isDebug && <axesHelper args={[20000]} />}
      <OrbitControls ref={controlsRef} />
      {genBackgroundStars()}
      {genBackgroundPlanets()}
      {genShootingStars()}
    </Canvas>
  );
};
