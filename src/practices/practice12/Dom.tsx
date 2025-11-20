import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useLayoutEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Star } from "../practice11/Objects/star";
import { Planet } from "../practice11/Objects/planet";
import { BigPlanet } from "../practice11/Objects/bigPlanet";
import "./styles.css";
import { SpiralText } from "./spiralText";
import { CanvasInputForwarder } from "../../components/CanvasInputForwarder";
import { Page1 } from "./Sections/Page1/Page1";
import { SVGMesh } from "../practice13/SVGLoader/svgLoader";
import { Page2 } from "./Sections/Page2/Page2";
import { Page3 } from "./Sections/Page3/Page3";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export const Dom = ({ isDebug = false }: { isDebug?: boolean }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const scrollcontainerRef = useRef<HTMLDivElement>(null);

  // interactive group ref: raycast는 이 그룹(및 자식)만 검사하도록 제한
  const interactiveRef = useRef<THREE.Group>(null!);

  const AutoZoomOut = ({
    speed = -10,
    controlsRef,
  }: {
    speed?: number;
    controlsRef?: React.RefObject<OrbitControlsImpl | null>;
  }) => {
    const { camera } = useThree();
    const dir = useRef(new THREE.Vector3());
    const minDist = 4000; // 카메라가 이 거리 안으로 들어가지 않게 함
    const eps = 1e-6;
    let acceleration = 50;
    let reachedEnd = false;

    useFrame((_, delta) => {
      const len = camera.position.length();

      // 지수적으로 상승하는 속도
      acceleration *= 1.01;
      speed -= 150 + acceleration++; // 시간이 지남에 따라 점점 더 빨라짐
      if (!isFinite(len) || len <= minDist + eps) {
        reachedEnd = true;
        return; // 안전 체크
      }

      if (reachedEnd) return;
      dir.current.copy(camera.position).normalize();
      const desiredMove = speed * delta;
      const maxAllowedMove = Math.max(0, len - minDist);
      const move = Math.min(desiredMove, maxAllowedMove);

      camera.position.addScaledVector(dir.current, move);
      controlsRef?.current?.update?.();
    });

    return null;
  };

  const genBackgroundStars = () => {
    const stars = [];
    for (let i = 0; i < 5000; i++) {
      const size = [15, 10, 15, 25, 7, 20][THREE.MathUtils.randInt(0, 5)];
      const pos = new THREE.Vector3(
        THREE.MathUtils.randInt(-150000, 150000),
        THREE.MathUtils.randInt(-150000, 150000),
        THREE.MathUtils.randInt(-150000, 150000)
      );
      stars.push(<Star key={i} position={pos} size={size} />);
    }
    return stars;
  };

  // 기존 genBackgroundPlanets를 그대로 쓰되, 렌더 시 group으로 감쌈
  const genBackgroundPlanets = () => {
    const planets = [];
    for (let i = 0; i < 250; i++) {
      const size = [800, 1000, 800, 2000, 1200][THREE.MathUtils.randInt(0, 4)];
      const pos = new THREE.Vector3(
        THREE.MathUtils.randInt(-100000, 120000),
        THREE.MathUtils.randInt(-100000, 120000),
        THREE.MathUtils.randInt(-100000, 120000)
      );
      planets.push(<Planet key={i} position={pos} size={size} />);
    }
    return planets;
  };

  const genBigPlanet = () => {
    const size = 20000;
    const pos = new THREE.Vector3(30000, 30000, 30000);
    return (
      <>
        <SpiralText position={pos} size={size} text=" Interactive Developer " />
        <BigPlanet position={pos} size={size} />
      </>
    );
  };

  useLayoutEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section-wrapper > section");

    // 가로 스크롤 애니메이션

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const horizontalScroll = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        id: "horizontal-scroll", // ← ID 추가 (중요!)
        trigger: ".section-wrapper",
        pin: true,
        scrub: 2,
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.25, max: 0.5 },
          delay: 0.1,
          ease: "power2.inOut",
        },
        end: () => `+=${(sections.length - 1) * window.innerWidth}`,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="dom-wrapper" ref={scrollcontainerRef}>
      <Canvas
        gl={{ antialias: false, alpha: false }} // antialias 끄기 권장(성능)
        dpr={[1, Math.min(window.devicePixelRatio || 1, 1.5)]} // DPR 제한
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
        camera={{
          near: 1,
          position: [-140000, -140000, -140000],
          rotation: [0, 0, 0],
          far: 100000,
        }}
      >
        <CanvasInputForwarder rootRef={interactiveRef} throttleMs={60} minMovePx={4} />
        <color attach="background" args={["#111111"]} />
        <ambientLight color={"#fff"} intensity={5} />
        <OrbitControls ref={controlsRef} />
        {isDebug && <axesHelper args={[100000]} />}
        <AutoZoomOut speed={-10} controlsRef={controlsRef} />
        <SVGMesh
          svgPath="/github_mark.svg"
          color="white"
          scale={40000000}
          depth={50}
          position={[-80000, -80000, -80000]}
        />

        {genBackgroundStars()}

        {/* interactive planets만 그룹에 넣음 -> raycast 대상 제한 */}
        <group ref={interactiveRef}>{genBackgroundPlanets()}</group>

        {genBigPlanet()}
      </Canvas>

      <div className="section-wrapper">
        <section className="section-01"></section>
        <section className="section-02">{<Page1 isDebug={isDebug} />}</section>
        <section className="section-03">{<Page2 />}</section>
        <section className="section-03">{<Page3 />}</section>
        <section className="section-03">4 페이지</section>
      </div>
    </div>
  );
};
