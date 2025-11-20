import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useParticleSystem } from "./useParticlesSystem";
import type { ParticleSystemConfig } from "./types";

interface Props extends ParticleSystemConfig {
  sourceRef: React.RefObject<THREE.Object3D>;
  velocityRef: React.RefObject<THREE.Vector3>;
}

export const ParticleRenderer = ({
  sourceRef,
  velocityRef,
  maxParticles,
  emitThreshold,
  particleLifetime,
  emitRate,
}: Props) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const { emit, update } = useParticleSystem({
    maxParticles,
    emitThreshold,
    particleLifetime,
    emitRate,
  });

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - 0.5);
          if (dist > 0.5) discard;
          float alpha = 1.0 - (dist * 2.0);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [maxParticles]);

  useFrame((state, delta) => {
    if (!sourceRef.current || !velocityRef.current) return;

    const vel = velocityRef.current;
    const speed = vel.length();

    if (speed > emitThreshold) {
      const worldPos = new THREE.Vector3();
      sourceRef.current.getWorldPosition(worldPos);
      emit(worldPos, vel, speed, state.clock.getElapsedTime());
    }

    const buffers = {
      positions: geometry.attributes.position.array as Float32Array,
      colors: geometry.attributes.color.array as Float32Array,
      sizes: geometry.attributes.size.array as Float32Array,
    };

    const activeCount = update(delta, buffers);

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    geometry.setDrawRange(0, activeCount);
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};
