import { useRef } from "react";
import * as THREE from "three";
import type { Particle, ParticleSystemConfig, ParticleBuffers } from "./types";

export const useParticleSystem = (config: ParticleSystemConfig) => {
  const particlesRef = useRef<Particle[]>([]);
  const lastEmitTime = useRef(0);

  const createParticle = (
    worldPos: THREE.Vector3,
    velocity: THREE.Vector3,
    speed: number
  ): Particle => {
    const emitDir = velocity.clone().normalize().negate();
    const randomOffset = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(0.3),
      THREE.MathUtils.randFloatSpread(0.3),
      THREE.MathUtils.randFloatSpread(0.3)
    );
    emitDir.add(randomOffset).normalize();

    return {
      position: worldPos.clone(),
      velocity: emitDir.clone().multiplyScalar(speed * THREE.MathUtils.randFloat(0.3, 0.6)),
      life: config.particleLifetime*0.8,
      maxLife: config.particleLifetime*0.8,
      size: THREE.MathUtils.randFloat(2, 6)*700,
      color: new THREE.Color("lightgrey"),
    };
  };

  const emit = (
    worldPos: THREE.Vector3,
    velocity: THREE.Vector3,
    speed: number,
    now: number
  ) => {
    if (speed < config.emitThreshold) return;
    if (now - lastEmitTime.current < 1 / config.emitRate) return;

    lastEmitTime.current = now;

    const emitCount = Math.min(3, Math.floor(speed / 10));
    for (let i = 0; i < emitCount; i++) {
      if (particlesRef.current.length >= config.maxParticles) {
        particlesRef.current.shift();
      }
      particlesRef.current.push(createParticle(worldPos, velocity, speed));
    }
  };

  const update = (delta: number, buffers: ParticleBuffers): number => {
    const particles = particlesRef.current;
    let activeCount = 0;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= delta;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // 물리 업데이트
      p.position.addScaledVector(p.velocity, delta);
      p.velocity.multiplyScalar(0.95);

      // 버퍼 업데이트
      const idx = activeCount * 3;
      const alpha = p.life / p.maxLife;

      buffers.positions[idx] = p.position.x;
      buffers.positions[idx + 1] = p.position.y;
      buffers.positions[idx + 2] = p.position.z;

      buffers.colors[idx] = p.color.r * alpha;
      buffers.colors[idx + 1] = p.color.g * alpha;
      buffers.colors[idx + 2] = p.color.b * alpha;

      buffers.sizes[activeCount] = p.size * alpha;

      activeCount++;
    }

    // 남은 버퍼 제로화
    for (let i = activeCount; i < config.maxParticles; i++) {
      buffers.positions[i * 3] = 0;
      buffers.positions[i * 3 + 1] = 0;
      buffers.positions[i * 3 + 2] = 0;
      buffers.sizes[i] = 0;
    }

    return activeCount;
  };

  return { emit, update };
};