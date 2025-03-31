"use client";

import { motion, Variants } from "framer-motion";
import HouseCarousel from "@/app/components/HouseCarousel";

// =======================
// Types
// =======================

import type { House } from "@/app/types/house";

type Props = {
  houses: House[];
  onHover?: (house: House) => void;
};

// =======================
// Animation Variants
// =======================

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

// =======================
// Component
// =======================

const HouseGrid = ({ houses, onHover }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1 w-full">
      {houses.map((house, index) => (
        <motion.div
          key={house.id}
          initial="hidden"
          animate="visible"
          variants={gridItemVariants}
          custom={index}
          onMouseEnter={() => onHover?.(house)}
        >
          <HouseCarousel house={house} onHover={() => onHover?.(house)} />
        </motion.div>
      ))}
    </div>
  );
};

export default HouseGrid;
