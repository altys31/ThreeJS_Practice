import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
}

export const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // ← 방향 state 추가

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000, // 다음: 오른쪽에서, 이전: 왼쪽에서
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000, // 다음: 왼쪽으로, 이전: 오른쪽으로
      opacity: 0,
    }),
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);
  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < images.length) {
      setDirection(newDirection); // ← 방향 저장
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-content">
        <AnimatePresence initial={false} custom={direction}>
          {" "}
          {/* ← direction 전달 */}
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            custom={direction} // ← direction 전달
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="carousel-image"
            alt={`Slide ${currentIndex + 1}`}
          />
        </AnimatePresence>

        {/* 이전 버튼 */}
        {currentIndex > 0 && (
          <button
            className="carousel-button carousel-button-prev"
            onClick={() => paginate(-1)}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* 다음 버튼 */}
        {currentIndex < images.length - 1 && (
          <button
            className="carousel-button carousel-button-next"
            onClick={() => paginate(1)}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Dots Pagination */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => {
              const newDirection = index > currentIndex ? 1 : -1; // ← 방향 계산
              setDirection(newDirection);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
