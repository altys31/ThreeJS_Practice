import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import "./Loader.css";
import { motion, AnimatePresence } from "framer-motion";

export const Loader = () => {
  const { progress, active } = useProgress();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (progress === 100 && !active) {
      const timer = setTimeout(() => setIsComplete(true), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="loader-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loader-content">
            <div className="loader-spinner" />
            <h2 className="loader-title">Loading Universe...</h2>
            <div className="loader-bar">
              <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="loader-percentage">{progress.toFixed(0)}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Canvas 내부용 폴백
export const CanvasFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="white" wireframe />
    </mesh>
  );
};
