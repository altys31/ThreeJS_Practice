import * as THREE from "three";
import { ParticleRenderer } from "./ParticlesRenderer";

interface Props {
  sourceRef: React.RefObject<THREE.Object3D>;
  velocityRef: React.RefObject<THREE.Vector3>;
  emitThreshold?: number;
  particleLifetime?: number;
}

export const PlanetTrailParticles = ({
  sourceRef,
  velocityRef,
  emitThreshold = 16,
  particleLifetime = 0.4,
}: Props) => {
  return (
    <ParticleRenderer
      sourceRef={sourceRef}
      velocityRef={velocityRef}
      maxParticles={200}
      emitThreshold={emitThreshold}
      particleLifetime={particleLifetime}
      emitRate={30} // 초당 30회 체크
    />
  );
};
