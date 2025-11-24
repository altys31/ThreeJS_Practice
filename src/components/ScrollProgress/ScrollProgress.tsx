import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollProgress.css";

interface ScrollProgressProps {
  totalSections: number;
}

export const ScrollProgress = ({ totalSections }: ScrollProgressProps) => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.getById("horizontal-scroll");
    if (!trigger) return;

    const updateSection = () => {
      const progress = trigger.progress || 0;
      const section = Math.round(progress * (totalSections - 1));
      setCurrentSection(section);
    };

    ScrollTrigger.addEventListener("refresh", updateSection);
    const interval = setInterval(updateSection, 100);

    return () => {
      ScrollTrigger.removeEventListener("refresh", updateSection);
      clearInterval(interval);
    };
  }, [totalSections]);

  return (
    <div className="scroll-progress">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          className={`scroll-dot ${index === currentSection ? "active" : ""}`}
          onClick={() => {
            const trigger = ScrollTrigger.getById("horizontal-scroll");
            if (trigger) {
              const targetProgress = index / (totalSections - 1);
              window.scrollTo({
                top: trigger.start + (trigger.end - trigger.start) * targetProgress * 0.95,
                behavior: "smooth",
              });
            }
          }}
          aria-label={`Go to section ${index + 1}`}
        >
          <span className="scroll-dot-label">{index + 1}</span>
        </button>
      ))}
    </div>
  );
};
