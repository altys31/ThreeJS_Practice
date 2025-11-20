import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

interface SVGMeshProps {
  svgPath: string;
  depth?: number;
  color?: string;
  position?: [number, number, number];
  scale?: number;
}

export const SVGMesh = ({
  svgPath,
  depth = 10,
  color,
  position = [0, 0, 0],
  scale = 1,
}: SVGMeshProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const loader = new SVGLoader();
    const group = groupRef.current;

    // 기존 메시 제거

    loader.load(
      svgPath,
      (data) => {
        const paths = data.paths;

        paths.forEach((path) => {
          const shapes = SVGLoader.createShapes(path);

          shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth,
              bevelEnabled: false,
            });

            const material = new THREE.MeshStandardMaterial({
              color: color || path.color || "#ffffff",
              side: THREE.DoubleSide,
            });

            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
          });
        });

        // 중심 정렬 (선택)
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        group.children.forEach((child) => {
          child.position.sub(center);
        });
      },
      undefined,
      (error) => {
        console.error("SVG 로딩 실패:", error);
      }
    );

    return () => {
      // cleanup
      group.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [svgPath, depth, color]);

  return <group ref={groupRef} position={position} scale={scale} />;
};
