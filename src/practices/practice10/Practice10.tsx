import { Canvas } from "@react-three/fiber";
import { Balls } from "./Balls";

// const LabeledSphere = ({ position }: { position: [number, number, number]; label: string }) => {
//   return (
//     <group position={position}>
//       <Billboard // follow, lockX/Y/Z 옵션으로 회전 제어 가능
//         position={[0, 1.6, 0]}
//         follow={true}
//       >
//         <group position={position}>
//           <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
//             <Html center occlude distanceFactor={1}></Html>
//           </Billboard>
//         </group>
//       </Billboard>
//     </group>
//   );
// };

export const Practice10 = ({ isDebug }: { isDebug: boolean }) => {
  return (
    <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 50] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Balls isDebug={isDebug} />
      {/* <LabeledSphere position={[0, 0, 0]} label="센터 구체" /> */}
    </Canvas>
  );
};
