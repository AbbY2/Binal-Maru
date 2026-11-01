import { useEffect, useRef } from 'react';
import { animate, motion, useInView } from 'motion/react';
import { VelocityMarquee } from '../ui/Marquee';
import { EASE_OUT } from '../../animations/shared/variants';

const stats = [
  { label: 'Students Taught', value: 1200, suffix: '+' },
  { label: 'Years Experience', value: 8, suffix: '+' },
  { label: 'Countries Reached', value: 12, suffix: '' },
  { label: 'Avg. Rating', value: 4.9, suffix: '', decimals: 1 },
];

const STYLES = ['Hatha', 'Ashtanga Vinyasa', 'Pranayama', 'Yin', 'Yoga Nidra', 'Breathwork'];

const CountUp: React.FC<{ target: number; decimals?: number; suffix: string }> = ({ target, decimals = 0, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    const format = (v: number) => `${decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN')}${suffix}`;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (ref.current) ref.current.textContent = format(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 2.4,
      ease: EASE_OUT,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = format(v); },
    });
    return () => controls.stop();
  }, [inView, target, decimals, suffix]);

  return <span ref={ref} className="tabular-nums">{decimals ? (0).toFixed(decimals) : 0}{suffix}</span>;
};

export const StatsCounter: React.FC = () => (
  <section id="stats" className="relative z-10 bg-bg pb-24 md:pb-32">
    <VelocityMarquee words={STYLES} className="text-ink py-8 border-y border-line" />
    <div className="max-w-7xl mx-auto px-6 mt-16 md:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-y-12">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay: i * 0.1, ease: EASE_OUT }}
          className="px-4 lg:px-8 lg:border-l border-line first:border-l-0"
        >
          <div className="display text-[clamp(3rem,6.5vw,5.5rem)] text-ink">
            <CountUp target={s.value} decimals={s.decimals} suffix={s.suffix} />
          </div>
          <span className="text-sm text-muted mt-2 block">{s.label}</span>
        </motion.div>
      ))}
    </div>
  </section>
);
