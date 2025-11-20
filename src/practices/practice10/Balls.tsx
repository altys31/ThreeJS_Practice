import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Ball } from "./ball";

export const Balls = ({ isDebug }: { isDebug: boolean }) => {
  const ballRadius = 0.5;
  const posVectors = useRef<THREE.Vector3[]>([]);
  const velVectors = useRef<THREE.Vector3[]>([]);

  const posLimit = 8 - ballRadius;
  const ballCount = 20;
  let velocity = 0.005;

  useEffect(() => {
    for (let i = 0; i < ballCount; i++) {
      const posX = THREE.MathUtils.randFloat(-posLimit, posLimit);
      const posY = THREE.MathUtils.randFloat(-posLimit, posLimit);
      const newVec = new THREE.Vector3(posX, posY, 0);
      checkCreation(newVec);
      posVectors.current.push(newVec);

      const dir = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1),
        0
      ).normalize();
      velVectors.current.push(dir);
    }
  }, []);

  const { viewport } = useThree();

  const checkCreation = (newVec: THREE.Vector3) => {
    // 새로운 공 생성 체크
    posVectors.current.forEach((vec, index) => {
      // 처음 위치가 겹치지 않도록 설정
      if (newVec.distanceTo(vec) < ballRadius * 2) {
        newVec.set(
          THREE.MathUtils.randFloat(-posLimit, posLimit),
          THREE.MathUtils.randFloat(-posLimit, posLimit),
          0
        );
        checkCreation(newVec);
      }
    });
  };
  const checkCollision = () => {
    // 공끼리 충돌 체크
    posVectors.current.forEach((vecA, indexA) => {
      posVectors.current.forEach((vecB, indexB) => {
        if (indexA !== indexB) {
          const distance = vecA.distanceTo(vecB);
          if (distance < ballRadius * 2) {
            // 충돌 시 반사각 계산
            const normal = vecA.clone().sub(vecB).normalize();
            const relativeVelocity = velVectors.current[indexA]
              .clone()
              .sub(velVectors.current[indexB]);
            const speed = relativeVelocity.dot(normal);
            if (speed < 0) {
              const impulse = normal.multiplyScalar((-2 * speed) / 2);
              velVectors.current[indexA].add(impulse);
              velVectors.current[indexB].sub(impulse);
            }
          }
        }
      });
    });
  };

  const movingBall = () => {
    posVectors.current.forEach((vec, index) => {
      const dir = velVectors.current[index].normalize();
      if (
        vec.x > viewport.width / -2 + ballRadius &&
        vec.x <= viewport.width / 2 - ballRadius &&
        vec.y > viewport.height / -2 + ballRadius &&
        vec.y <= viewport.height / 2 - ballRadius
      ) {
        vec.add(velVectors.current[index].copy(dir).multiplyScalar(velocity));
      } else {
        //벽에 부딪혔을때 반사각
        if (vec.x <= viewport.width / -2 + ballRadius || vec.x >= viewport.width / 2 - ballRadius) {
          velVectors.current[index].setX(velVectors.current[index].x * -1);
        }
        if (
          vec.y <= viewport.height / -2 + ballRadius ||
          vec.y >= viewport.height / 2 - ballRadius
        ) {
          velVectors.current[index].setY(velVectors.current[index].y * -1);
        }
        vec.add(velVectors.current[index].copy(dir).multiplyScalar(velocity));
      }
    });
    if (velocity < 0.1) {
      velocity += 0.00002;
    }
  };

  useFrame(() => {
    movingBall();
    checkCollision();
  });

  return (
    <>
      <ambientLight intensity={5} />
      <directionalLight position={[5, 5, 5]} />
      {isDebug && <axesHelper args={[7]} />}
      {isDebug && (
        <gridHelper rotation={[THREE.MathUtils.degToRad(90), 0, 0]} args={[100, 100, "red"]} />
      )}
      <CameraControls />
      {posVectors.current.map((vec, index) => (
        <Ball
          key={index}
          vec={vec}
          dir={velVectors.current[index]}
          ballRadius={ballRadius}
          isDebug={isDebug}
        />
      ))}
    </>
  );
};
