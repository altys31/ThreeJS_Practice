import { Billboard } from "@react-three/drei";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const SpiralText = ({
  position,
  text,
  size,
}: {
  position: THREE.Vector3;
  text: string;
  size: number;
}) => {
  const count = 360;
  const amplitude = 250;
  const xTimes = 150;
  const reversedText = text.split("").reverse().join("");
  const COLOR = ["#ff6464", "#feffad"];
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const x = i * xTimes;
    const sin = Math.sin(THREE.MathUtils.degToRad(i)) * amplitude;
    const cos = Math.cos(THREE.MathUtils.degToRad(i)) * amplitude;
    const pos = new THREE.Vector3(
      position.x - 45000,
      position.y + sin - 47500,
      position.z + cos - 47500
    );
    points.push(pos);
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const curvePointCount = text.length - 1;
  const curvePoints = curve.getPoints(curvePointCount);
  const curveGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!curveGroupRef.current) return;
    curveGroupRef.current.children.forEach((curve) => {
      curve.rotation.x += 0.0075;
      curve.children.forEach((text) => {
        const zPos = new THREE.Vector3();
        text.getWorldPosition(zPos);

        const scale = THREE.MathUtils.mapLinear(
          zPos.x + zPos.z / 2,
          -amplitude,
          amplitude,
          0.2,
          1.5
        );
        text.scale.set(scale, scale, scale);
      });
    });
  });

  return (
    <group
      ref={curveGroupRef}
      position={[position.x + 5000, position.y, position.z + 1500]}
      rotation={[180, 120, 0]}
    >
      {curvePoints.length &&
        curvePoints.map((point, index) => {
          const deg = (360 / curvePoints.length) * index;
          const rad = THREE.MathUtils.degToRad(deg);
          return (
            <group key={index} rotation={[rad, 0, 0]}>
              <Billboard key={index} position={point}>
                <Text
                  fontSize={60}
                  fontWeight={"extraBold"}
                  font="/font/ThreeDimRightwardsRound.ttf"
                  color={new THREE.Color(COLOR[index % COLOR.length])}
                >
                  {reversedText[index]}
                </Text>
              </Billboard>
            </group>
          );
        })}
    </group>
  );
};
