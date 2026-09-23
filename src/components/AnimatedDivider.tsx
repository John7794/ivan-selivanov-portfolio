import React from 'react';
import { motion } from 'motion/react';

interface AnimatedDividerProps {
  className?: string;
  duration?: number;
  repeatDelay?: number;
}

export const AnimatedDivider: React.FC<AnimatedDividerProps> = ({
  className = '',
  duration = 4.2,
  repeatDelay = 1.0,
}) => {
  return (
    <div className={`relative w-full h-[1px] bg-neutral-800/90 overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '400%' }}
        transition={{
          duration,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay,
        }}
        className="w-1/3 h-full absolute top-0 bg-gradient-to-r from-transparent via-neutral-200/55 to-transparent pointer-events-none"
      />
    </div>
  );
};
