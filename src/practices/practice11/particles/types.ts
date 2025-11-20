import * as THREE from "three";

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

export interface ParticleSystemConfig {
  maxParticles: number;
  emitThreshold: number;
  particleLifetime: number;
  emitRate: number; // 초당 생성 개수
}

export interface ParticleBuffers {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
}