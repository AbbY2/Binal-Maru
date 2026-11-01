import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';

/** Soft halo trailing the native cursor; it swells and labels `data-cursor` targets. */
export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('idle');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 28, stiffness: 260, mass: 0.5 });
  const ringY = useSpring(y, { damping: 28, stiffness: 260, mass: 0.5 });

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      const labelled = el.closest<HTMLElement>('[data-cursor]');
      if (labelled) setMode(labelled.dataset.cursor || 'hover');
      else setMode(el.closest('a, button, select, input, textarea') ? 'hover' : 'idle');
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  const hasLabel = mode !== 'idle' && mode !== 'hover';
  const size = hasLabel ? 84 : mode === 'hover' ? 54 : 26;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: size,
        height: size,
        backgroundColor: hasLabel ? 'rgba(162,78,42,0.92)' : mode === 'hover' ? 'rgba(227,160,79,0.22)' : 'rgba(227,160,79,0)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="fixed top-0 left-0 z-[95] rounded-full border border-terra/60 pointer-events-none flex items-center justify-center"
    >
      <AnimatePresence>
        {hasLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="eyebrow !text-[0.65rem] !tracking-[0.15em] text-cream"
          >
            {mode}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
