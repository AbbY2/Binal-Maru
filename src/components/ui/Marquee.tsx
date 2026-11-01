import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';

const wrap = (value: number) => ((value % 50) + 50) % 50;

/** Ribbon of words that drifts on its own and surges with scroll speed. */
export const VelocityMarquee: React.FC<{ words: string[]; className?: string }> = ({ words, className = '' }) => {
  const reduced = useReducedMotion();
  const base = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const x = useTransform(base, (v) => `-${wrap(v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    base.set(base.get() + direction.current * (delta / 1000) * 1.1 * (1 + Math.abs(f)));
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <motion.div style={{ x }} className="flex w-max">
        {[0, 1].map((n) => (
          <div key={n} className="flex items-center shrink-0">
            {[...words, ...words].map((word, i) => (
              <span key={i} className="flex items-center">
                <span className={`display text-[clamp(2.4rem,7vw,6rem)] px-6 ${i % 2 ? 'italic text-terra' : ''}`}>{word}</span>
                <span className="w-3 h-3 rounded-full bg-sun shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
