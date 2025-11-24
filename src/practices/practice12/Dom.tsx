import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useLayoutEffect, useRef, Suspense, useMemo } from "react";
import { OrbitControls, Preload } from "@react-three/drei";
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
import { Loader, CanvasFallback } from "../../components/Loader/Loader";
import { ScrollProgress } from "../../components/ScrollProgress/ScrollProgress";
import { ScrollHint } from "../../components/ScrollHint/ScrollHint";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export const Dom = ({ isDebug = false }: { isDebug?: boolean }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const scrollcontainerRef = useRef<HTMLDivElement>(null);
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
    const minDist = 4000;
    const eps = 1e-6;
    let acceleration = 50;
    let reachedEnd = false;

    useFrame((_, delta) => {
      const len = camera.position.length();
      acceleration *= 1.01;
      speed -= 150 + acceleration++;
      if (!isFinite(len) || len <= minDist + eps) {
        reachedEnd = true;
        return;
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

  const genBackgroundStars = useMemo(() => {
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
  }, []);

  const genBackgroundPlanets = useMemo(() => {
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
  }, []);

  const genBigPlanet = useMemo(() => {
    const size = 20000;
    const pos = new THREE.Vector3(30000, 30000, 30000);
    return (
      <>
        <SpiralText position={pos} size={size} text=" Interactive Developer " />
        <BigPlanet position={pos} size={size} />
      </>
    );
  }, []);

  useLayoutEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section-wrapper > section");

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        id: "horizontal-scroll",
        trigger: ".section-wrapper",
        pin: true,
        scrub: 0.75,
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.1, max: 0.2 },
          delay: 0.1,
          ease: "power1.inOut",
          directional: true,
        },
        end: () => `+=${(sections.length - 1) * window.innerWidth}`,
        anticipatePin: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="dom-wrapper" ref={scrollcontainerRef}>
      <Loader />
      <ScrollProgress totalSections={4} />
      <ScrollHint />
      <Canvas
        gl={{ antialias: false, alpha: false }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 1.5)]}
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
        <Suspense fallback={<CanvasFallback />}>
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

          {genBackgroundStars}
          <group ref={interactiveRef}>{genBackgroundPlanets}</group>
          {genBigPlanet}

          <Preload all />
        </Suspense>
      </Canvas>

      <div className="section-wrapper">
        <section className="section-01"></section>
        <section className="section-02">
          <Page1 isDebug={isDebug} />
        </section>
        <section className="section-03">
          <Page2 />
        </section>
        <section className="section-04">
          <Page3 />
        </section>
      </div>
    </div>
  );
};
