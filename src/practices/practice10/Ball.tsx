import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Ball = ({
  vec,
  ballRadius,
  dir,
  isDebug = false,
}: {
  vec: THREE.Vector3;
  ballRadius: number;
  dir: THREE.Vector3;
  isDebug?: boolean;
}) => {
  const ball = useRef<THREE.Mesh>(null);
  const dirRef = useRef<THREE.Vector3>(dir.clone());
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);

  useFrame(() => {
    if (ball.current) {
      // 부모가 관리하는 vec를 매 프레임으로 복사
      ball.current.position.copy(vec);
    }
    // copy the incoming direction into the ref so we keep a stable object)
    dirRef.current.copy(dir);

    if (arrowRef.current) {
      arrowRef.current.setDirection(dirRef.current.clone().normalize());
    }
  });

  return (
    <>
      <mesh ref={ball} position={vec}>
        <sphereGeometry args={[ballRadius, 32, 32]} />
        <meshStandardMaterial
          color={["red", "green", "blue", "yellow", "purple"][Math.floor(Math.random() * 5)]}
        />
        {isDebug && (
          <arrowHelper
            ref={arrowRef}
            args={[dirRef.current.clone().normalize(), new THREE.Vector3(0, 0, 0), 1.5, "black"]}
          />
        )}
      </mesh>
    </>
  );
};
