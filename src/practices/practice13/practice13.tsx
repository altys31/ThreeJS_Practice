import { Billboard, CameraControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SVGMesh } from "./SVGLoader/svgLoader";

export const Practice13 = () => {
  const textStr = "creative coding exploration";
  const curveCount = 3;

  const curveGroupRef = useRef<THREE.Group>(null);
  const points: THREE.Vector3[] = [];
  const pointsGroup: THREE.Vector3[][] = [];
  const count = 360;
  const amplitude = 10;
  const xDivision = 10;
  const curveGroupX = (count / xDivision) * 0.5;

  const Point = ({ vec, color, text }: { vec: THREE.Vector3; color: string; text: string }) => {
    // 한 번만 생성
    // const geo = useMemo(() => new THREE.SphereGeometry(0.1, 8, 8), []);
    // const mat = useMemo(() => new THREE.MeshBasicMaterial({ color }), [color]);

    useFrame(() => {
      if (!curveGroupRef.current) return;
      curveGroupRef.current.children.forEach((curve) => {
        curve.rotation.x += 0.0001;
        curve.children.forEach((text) => {
          const zPos = new THREE.Vector3();
          text.getWorldPosition(zPos);

          const scale = THREE.MathUtils.mapLinear(zPos.z, -amplitude, amplitude, 0.2, 1.5);
          text.scale.set(scale, scale, scale);
        });
      });
    });

    return (
      <Billboard position={vec}>
        <Text fontSize={2} color={color}>
          {text}
        </Text>
      </Billboard>
    );
  };

  for (let i = 0; i < count; i++) {
    const x = i / xDivision;
    const sin = Math.sin(THREE.MathUtils.degToRad(i)) * amplitude;
    const cos = Math.cos(THREE.MathUtils.degToRad(i)) * amplitude;

    const pos = new THREE.Vector3(x, sin, cos);
    points.push(pos);
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoinCount = textStr.length - 1;
  const curvePoints = curve.getPoints(curvePoinCount);

  for (let i = 0; i < curveCount; i++) {
    pointsGroup.push(curvePoints);
  }

  return (
    <Canvas camera={{ position: [0, 20, 30], fov: 60, near: 0.1, far: 1000 }}>
      <SVGMesh svgPath="/github_mark.svg" scale={0.01} depth={50} color="white" />
      <group ref={curveGroupRef} position={[-curveGroupX, 0, 0]}>
        {pointsGroup.map((curvePoints: THREE.Vector3[], curveIndex: number) => {
          const deg = (curveIndex * 360) / curveCount;
          const rad = THREE.MathUtils.degToRad(deg);
          return curvePoints.length ? (
            <group rotation={[rad, 0, 0]}>
              {curvePoints.map((point: THREE.Vector3, index: number) => {
                return <Point vec={point} color={"red"} text={textStr[index]} key={index} />;
              })}
            </group>
          ) : (
            <></>
          );
        })}
      </group>
      <CameraControls />
      <gridHelper args={[100, 100, `white`, `gray`]} />
    </Canvas>
  );
};
