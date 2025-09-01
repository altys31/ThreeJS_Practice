import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function makeStreakTexture() {
  const w = 64,
    h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // 세로 그라디언트(아래쪽이 얇아지는 삼각형 느낌)
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0.0, "rgba(255,255,255,0.0)");
  grad.addColorStop(0.15, "rgba(255,255,255,0.35)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.8)");
  grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
  ctx.fillStyle = grad;

  // 중앙에 세로 스트립(살짝 삼각형처럼 좁아지는 형태)
  ctx.beginPath();
  const mid = w / 2;
  ctx.moveTo(mid - 1, 0);
  ctx.lineTo(mid + 1, 0);
  ctx.lineTo(mid + 0.5, h);
  ctx.lineTo(mid - 0.5, h);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export const Rain = ({ count = 5000, area = 50, fallSpeed = 15 }) => {
  const ref = useRef<THREE.Points>(null!);
  const velocities = useRef<Float32Array>(new Float32Array(count));

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * area;
      p[i * 3 + 1] = Math.random() * area * 0.8 + 10; // 높은 곳에서 시작
      p[i * 3 + 2] = (Math.random() - 0.5) * area;
      velocities.current[i] = 5 + Math.random() * 5; // 개별 낙하 속도 차이
    }
    return p;
  }, [count, area]);

  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  useEffect(() => {
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  }, [geom, positions]);

  // 스트릭 텍스처
  const streakMap = useMemo(() => makeStreakTexture(), []);

  useFrame((_, dt) => {
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - (fallSpeed + velocities.current[i]) * dt;
      if (y < -2) {
        // 바닥 아래로 가면 위로 재배치
        y = 10 + Math.random() * 10;
      }
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.2} // 길쭉함을 키우려면 size를 키우세요
        sizeAttenuation // 원근에 따라 크기 감쇠
        map={streakMap} // 세로 스트릭
        transparent
        depthWrite={false}
        opacity={0.9}
        alphaTest={0.01}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
