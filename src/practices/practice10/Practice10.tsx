import { Canvas } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { Balls } from "./Balls";

function IconBillboard({
  pos,
  texture,
}: {
  pos: [number, number, number];
  texture: THREE.Texture;
}) {
  return (
    <mesh position={pos}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthTest={true} depthWrite={false} />
      {/* 매 프레임 카메라를 바라보게 하려면 useFrame에서 mesh.lookAt(camera.position) */}
    </mesh>
  );
}

const LabeledSphere = ({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) => {
  return (
    <group position={position}>
      <Billboard // follow, lockX/Y/Z 옵션으로 회전 제어 가능
        position={[0, 1.6, 0]}
        follow={true}
      >
        <group position={position}>
          <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
            <Html center occlude distanceFactor={1}>
              <button
                style={{
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  padding: 6,
                  borderRadius: 4,
                  width: "1px",
                  fontSize: "1px",
                }}
              >
                {"헤이헤이헤이"}
              </button>
            </Html>
          </Billboard>
        </group>
      </Billboard>
    </group>
  );
};

export const Practice10 = ({ isDebug }: { isDebug: boolean }) => {
  return (
    <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 50] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Balls isDebug={isDebug} />
      <LabeledSphere position={[0, 0, 0]} label="센터 구체" />
    </Canvas>
  );
};
