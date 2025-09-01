// WASDController.tsx
import type { RefObject } from "react";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboard } from "./useKeyboard";

type Props = {
  ballRef: RefObject<THREE.Mesh>;
  hVel: React.MutableRefObject<THREE.Vector3>; // 수평 속도 (x,z)
  paused?: boolean;
  radius?: number; // 공 반지름(기본 0.5)
  accel?: number; // 가속도 m/s^2
  drag?: number; // 감속(마찰) 계수
  maxSpeed?: number; // 최대속도 m/s
};

export const WASDController = ({
  ballRef,
  hVel,
  paused = false,
  radius = 0.5,
  accel = 24,
  drag = 4,
  maxSpeed = 24,
}: Props) => {
  const keys = useKeyboard();
  const { camera } = useThree();

  // 재사용 스크래치 벡터/쿼터니언 (GC 최소화)
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const axis = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, delta) => {
    if (!ballRef.current || paused) return;

    // 카메라 기준 전후/좌우 벡터 (XZ 평면)
    camera.getWorldDirection(fwd).setY(0).normalize();
    right.copy(fwd).cross(up).normalize();

    const forwardAmt = (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0);
    const rightAmt = (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0);

    // 원하는 가속도 벡터
    desired.copy(fwd).multiplyScalar(forwardAmt).addScaledVector(right, rightAmt);
    if (desired.lengthSq() > 0) {
      desired.normalize().multiplyScalar(accel * delta * (keys.current.shift ? 1.5 : 1));
      hVel.current.add(desired);
    }

    // 스페이스로 브레이크
    if (keys.current.space) {
      const brake = Math.max(0, 1 - 20 * delta);
      hVel.current.multiplyScalar(brake);
    }

    // 마찰(입력 없을 때 천천히 감속)
    const decay = Math.max(0, 1 - drag * delta);
    hVel.current.multiplyScalar(decay);

    // 최대 속도 제한 & 스냅
    if (hVel.current.length() > maxSpeed) hVel.current.setLength(maxSpeed);
    if (hVel.current.lengthSq() < 1e-6) hVel.current.set(0, 0, 0);

    // 위치 업데이트 (XZ만)
    ballRef.current.position.addScaledVector(hVel.current, delta);

    // "굴러가는" 회전: 회전축 = up × velocity  (속도에 수직)
    const speed = hVel.current.length();
    if (speed > 1e-5 && radius > 0) {
      axis.copy(up).cross(hVel.current).normalize(); // up × v
      const angle = (speed * delta) / radius; // s = r*θ → θ = s/r
      q.setFromAxisAngle(axis, angle);
      // before
      //ballRef.current.quaternion.multiply(q);
      ballRef.current.quaternion.premultiply(q);
    }
  });

  return null;
};
