import { SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { SiStorybook } from "react-icons/si";
import { TbBrandThreejs } from "react-icons/tb";
import "./style.css";
import LogoLoop from "../../../../components/logoLoop/LogoLoop";
import { FaGithub } from "react-icons/fa";
import { AnimatedName } from "../../../../components/AnimatedName/AnimatedName";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Page1 = ({ isDebug }: { isDebug: boolean }) => {
  const [showName, setShowName] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const techLogos = [
    { node: <SiReact color="white" />, title: "React", href: "https://react.dev" },
    {
      node: <SiTypescript color="white" />,
      title: "TypeScript",
      href: "https://www.typescriptlang.org",
    },
    {
      node: <TbBrandThreejs color="white" />,
      title: "Three.js",
      href: "https://threejs.org",
    },
    {
      node: <SiStorybook color="white" />,
      title: "Storybook",
      href: "https://storybook.js.org",
    },
    {
      node: <SiTailwindcss color="white" />,
      title: "Tailwind CSS",
      href: "https://tailwindcss.com",
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "center center",
      onEnter: () => setShowName(true),
      markers: isDebug,
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div className="first-profile-container" ref={sectionRef}>
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="left"
        logoHeight={32}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#000000"
        ariaLabel="Technology partners"
      />
      <div>
        <header className="page-header">
          <a href="https://github.com/altys31" target="_blank" rel="noopener noreferrer">
            <FaGithub size={32} color="white" />
          </a>
        </header>
        <main className="main">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            안녕하세요, 프론트엔드 개발자 <AnimatedName isVisible={showName} startDelay={2} />
            입니다.
          </motion.h1>
          <p style={{ fontWeight: "500" }}>
            사용자 경험을 최우선의 가치로 두고, 실험적인 시도와 새로운 인터랙션을 통해
            <br />
            웹에 '움직임'과 '감각'을 더하는 작업을 즐깁니다
          </p>
        </main>
        <footer className="footer">© 2025 Altys31. All rights reserved.</footer>
      </div>
      <LogoLoop
        logos={techLogos}
        speed={120}
        direction="right"
        logoHeight={32}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#000000"
        ariaLabel="Technology partners"
      />
    </div>
  );
};
