import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { PlanetTrailParticles } from "../particles/PlanetTrailParticles";

export const Planet = ({ size, position }: { size: number; position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const Y_AXIS = new THREE.Vector3(0, 1, 0);
  const { camera } = useThree();

  const COLOR = ["#63a9ff", "white", "#f9d397", "#ff6262", "#b7d7ff", "#e0c31d", "#f1ffd6"];
  const baseHex = COLOR[THREE.MathUtils.randInt(0, COLOR.length - 1)];

  // --- geometry + vertex color 생성 (한 번만) ---
  const { geometry, material } = useMemo(() => {
    const safeSize = Math.max(0.01, size);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 20; i++) {
      const dir = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1),
        THREE.MathUtils.randFloatSpread(1)
      );
      if (dir.lengthSq() < 1e-6) dir.set(1, 0, 0);
      dir.normalize();
      const r = safeSize * THREE.MathUtils.randFloat(0.6, 1.05);
      const jitter = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(safeSize * 0.03),
        THREE.MathUtils.randFloatSpread(safeSize * 0.03),
        THREE.MathUtils.randFloatSpread(safeSize * 0.03)
      );
      pts.push(dir.multiplyScalar(r).add(jitter));
    }

    let geom: THREE.BufferGeometry;
    try {
      geom = new ConvexGeometry(pts);
    } catch (e) {
      console.warn("ConvexGeometry 실패, Icosahedron으로 폴백", e);
      geom = new THREE.IcosahedronGeometry(safeSize, 0);
    }

    const nonIndexed = geom.index ? geom.toNonIndexed() : geom.clone();
    const posAttr = nonIndexed.getAttribute("position") as THREE.BufferAttribute;
    const vertexCount = posAttr.count;
    const colors = new Float32Array(vertexCount * 3);
    const baseColor = new THREE.Color(baseHex);
    const lightDir = new THREE.Vector3(1, 0.6, 0.2).normalize();

    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();
    const e1 = new THREE.Vector3();
    const e2 = new THREE.Vector3();
    const faceNormal = new THREE.Vector3();
    const tempColor = new THREE.Color();

    for (let i = 0; i < vertexCount; i += 3) {
      pA.fromBufferAttribute(posAttr, i);
      pB.fromBufferAttribute(posAttr, i + 1);
      pC.fromBufferAttribute(posAttr, i + 2);

      e1.subVectors(pB, pA);
      e2.subVectors(pC, pA);
      faceNormal.crossVectors(e1, e2).normalize();

      const ndl = Math.max(0, faceNormal.dot(lightDir));
      const shade = 0.35 + 0.65 * ndl;

      tempColor.copy(baseColor).multiplyScalar(shade);
      const hueShift = THREE.MathUtils.randFloatSpread(0.02);
      tempColor.offsetHSL(
        hueShift,
        THREE.MathUtils.randFloatSpread(0.06),
        THREE.MathUtils.randFloatSpread(0.04)
      );

      colors[(i + 0) * 3 + 0] = tempColor.r;
      colors[(i + 0) * 3 + 1] = tempColor.g;
      colors[(i + 0) * 3 + 2] = tempColor.b;

      colors[(i + 1) * 3 + 0] = tempColor.r;
      colors[(i + 1) * 3 + 1] = tempColor.g;
      colors[(i + 1) * 3 + 2] = tempColor.b;

      colors[(i + 2) * 3 + 0] = tempColor.r;
      colors[(i + 2) * 3 + 1] = tempColor.g;
      colors[(i + 2) * 3 + 2] = tempColor.b;
    }

    nonIndexed.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
    });

    return { geometry: nonIndexed, material: mat };
  }, [size, baseHex]);

  // cleanup
  useEffect(() => {
    const m = meshRef.current;
    if (!m) return;

    const handler = (intersection: THREE.Intersection, ev?: PointerEvent) => {
      // build a minimal ThreeEvent-like object expected by handlePointerEnter
      const fake = {
        point: (intersection.point || new THREE.Vector3()).clone(),
        face: intersection.face || null,
        // ray.direction: prefer intersection.ray.direction if present, otherwise compute from camera
        ray: {
          direction: intersection.ray?.direction
            ? intersection.ray.direction.clone().normalize()
            : intersection.point
            ? intersection.point
                .clone()
                .sub(camera?.position ?? new THREE.Vector3())
                .normalize()
            : new THREE.Vector3(0, 0, 1),
        },
      } as unknown as ThreeEvent<PointerEvent>;
      try {
        handlePointerEnter(fake);
      } catch (err) {
        console.error("onPointerHit handler failed", err);
      }
    };

    m.userData = m.userData || {};
    m.userData.onPointerHit = handler;
    return () => {
      if (m && m.userData) delete m.userData.onPointerHit;
    };
  }, [camera]);

  // --- 상호작용: 마우스 닿으면 멀리 날아가게 ---
  const tmpVec = useRef(new THREE.Vector3());
  const worldPos = useRef(new THREE.Vector3());
  const lastFleeTime = useRef(0);
  const FLEE_COOLDOWN = 0.24; // 초
  const FLEE_STRENGTH_BASE = Math.max(8, size * 30); // 크기 기반 스케일
  const DAMPING = 2.0; // 초당 감쇠 계수

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    const now = performance.now() / 1000;
    if (now - lastFleeTime.current < FLEE_COOLDOWN) return;
    lastFleeTime.current = now;

    if (!meshRef.current) return;

    // 충돌 지점(월드), 레이 방향(월드)
    const hitPoint: THREE.Vector3 = e.point.clone();
    const rayDir: THREE.Vector3 = e.ray.direction.clone().normalize();

    // 우선순위: 면 법선(있다면) -> 레이 방향 -> (플레이스홀더) 중심 기준 방향
    let impulseDir: THREE.Vector3 | null = null;

    if (e.face && meshRef.current) {
      // face.normal은 로컬 좌표이므로 월드로 변환
      const localNormal = e.face.normal.clone();
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(meshRef.current.matrixWorld);
      const worldNormal = localNormal.applyMatrix3(normalMatrix).normalize();
      impulseDir = worldNormal.clone(); // 표면 바깥 방향
    } else if (rayDir) {
      // 마우스가 쏜 레이 방향(카메라 -> 씬). 물체를 레이 방향으로 밀어내려면 그대로 사용
      impulseDir = rayDir.clone().normalize();
    } else if (hitPoint) {
      // fallback: 충돌점에서 중심으로 향하는 방향의 반대(표면 바깥)
      meshRef.current.getWorldPosition(worldPos.current);
      impulseDir = worldPos.current.clone().sub(hitPoint).normalize();
    } else {
      return;
    }

    // 약간의 난수 섞기로 자연스러움 추가
    const jitter = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(0.25),
      THREE.MathUtils.randFloatSpread(0.25),
      THREE.MathUtils.randFloatSpread(0.25)
    );
    impulseDir.add(jitter).normalize();

    // 힘(크기 기반)
    const strength = FLEE_STRENGTH_BASE * THREE.MathUtils.randFloat(0.9, 1.4);
    velocity.current.add(impulseDir.multiplyScalar(strength));
  };

  // useFrame: 위치 갱신 및 감쇠
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // 회전 약간 유지
    meshRef.current.position.applyAxisAngle(Y_AXIS, delta / 100);

    // velocity로 이동
    meshRef.current.position.addScaledVector(velocity.current, delta);

    // 감쇠: 지수적 감쇠 (프레임 독립)
    const decay = Math.exp(-DAMPING * delta);
    velocity.current.multiplyScalar(decay);

    // 아주 작아지면 0으로 놓음
    if (velocity.current.lengthSq() < 1e-6) velocity.current.set(0, 0, 0);
  });

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        position={position}
        onPointerEnter={handlePointerEnter}
      />

      <PlanetTrailParticles
        sourceRef={meshRef}
        velocityRef={velocity}
        emitThreshold={8}
        particleLifetime={0.6}
      />
    </>
  );
};
