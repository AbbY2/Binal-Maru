import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/** Lets a control lean toward the pointer, then spring back. */
export const Magnetic: React.FC<{ children: ReactNode; strength?: number; className?: string }> = ({
  children, strength = 0.25, className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
};
