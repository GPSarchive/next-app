// components/HouseGrid.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import HouseCarousel from './HouseCarousel';
import { House } from '@/app/types/house';

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
};

type Props = {
  houses: House[];
  onHover?: (house: House) => void;
};

const HouseGrid: React.FC<Props> = ({ houses, onHover }) => (
  <div
    className="w-full h-full overflow-y-scroll hide-scrollbar"
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
  >
    <style jsx global>{`
      .hide-scrollbar::-webkit-scrollbar { display: none; }
    `}</style>

<div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1 w-full hide-scrollbar"
      >

      {houses.map((house, index) => (
        <motion.div
          key={house.id}
          initial="hidden"
          animate="visible"
          variants={gridItemVariants}
          custom={index}
          onMouseEnter={() => onHover?.(house)}
          className={`rounded-lg transition-shadow duration-200 hover:shadow-lg border-[0.5px] border-black ${
            !house.isPublic ? 'border-2 border-yellow-400' : ''
          } h-full`}
        >
          <HouseCarousel house={house} onHover={() => onHover?.(house)} />
        </motion.div>
      ))}
    </div>
  </div>
);

export default HouseGrid;