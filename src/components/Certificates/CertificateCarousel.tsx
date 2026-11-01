import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHead } from '../ui/Reveal';
import { EASE_OUT } from '../../animations/shared/variants';

const certificates = [
  { title: 'Master of Yoga (M.Y.A.Sc)', issuer: 'University of Yoga Sciences', year: '2018', description: 'Advanced academic degree covering Hatha, Raja, and Jnana yoga with specialized training in therapeutic yoga and yogic anatomy.' },
  { title: 'Certified Professional Yoga Trainer', issuer: 'Yoga Alliance International', year: '2019', description: 'Professional-level certification for designing and delivering personalized yoga programs across all fitness levels.' },
  { title: 'Holistic Life Coach', issuer: 'International Coaching Federation', year: '2024', description: 'Integrated coaching certification combining yogic philosophy with modern nervous-system regulation and wellness design.' },
  { title: 'Advanced Breathwork Facilitator', issuer: 'Breath Science Academy', year: '2023', description: 'Deep-dive training in HRV coherence, resonant breathing protocols, and biofeedback-assisted breathwork.' },
  { title: 'Yoga & Wellness Lecturer', issuer: 'Gandhinagar Institute of Yogic Studies', year: '2020', description: 'Pedagogical certification for teaching yoga at the university level, including curriculum design.' },
];

const SWIPE_DISTANCE = 90;

export const CertificateCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = certificates.length;

  const go = (step: number) => {
    setDirection(step);
    setCurrent((c) => (c + step + total) % total);
  };

  const navButton = 'w-12 h-12 rounded-full border border-line text-ink flex items-center justify-center hover:bg-ink hover:text-bg transition-colors duration-300 cursor-pointer';

  return (
    <section id="certificates" className="relative z-10 bg-bg py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead eyebrow="Credentials" title={[{ em: 'Certifications' }]} center className="mb-14" />

        <div className="relative max-w-2xl mx-auto h-[420px] md:h-[360px]" style={{ perspective: 1400 }}>
          {[2, 1].map((depth) => (
            <motion.div
              key={depth}
              aria-hidden="true"
              animate={{ rotate: (current % 2 ? -1 : 1) * depth * 2.4, y: depth * 12, scale: 1 - depth * 0.035 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="absolute inset-0 rounded-[2rem] bg-surface border border-line"
            />
          ))}

          <AnimatePresence initial={false} custom={direction}>
            <motion.article
              key={current}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_DISTANCE) go(1);
                else if (info.offset.x > SWIPE_DISTANCE) go(-1);
              }}
              data-cursor="Drag"
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 120, rotateY: d * 28, scale: 0.94 }),
                center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
                exit: (d: number) => ({ opacity: 0, x: d * -240, rotateY: d * -30, rotate: d * -6 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.75, ease: EASE_OUT }}
              className="absolute inset-0 rounded-[2rem] bg-surface border border-line p-8 md:p-10 flex flex-col shadow-2xl shadow-[var(--shadow)] cursor-grab active:cursor-grabbing touch-pan-y"
            >
              <div className="absolute inset-3 rounded-[1.5rem] border border-sun/40 pointer-events-none" />
              <div className="flex items-center justify-between gap-4">
                <span className="w-14 h-14 rounded-full bg-gradient-to-br from-sun to-kit-terra text-cream flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </span>
                <span className="display italic text-3xl text-terra">{certificates[current].year}</span>
              </div>
              <h3 className="display text-[clamp(1.9rem,4vw,2.8rem)] text-ink mt-6">{certificates[current].title}</h3>
              <span className="text-sm font-semibold text-sage mt-2">{certificates[current].issuer}</span>
              <p className="text-base text-muted leading-relaxed mt-4">{certificates[current].description}</p>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-5 mt-12">
          <button onClick={() => go(-1)} aria-label="Previous certificate" className={navButton}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="display text-xl text-ink tabular-nums" aria-live="polite">
            {current + 1} <span className="text-muted">/ {total}</span>
          </span>
          <button onClick={() => go(1)} aria-label="Next certificate" className={navButton}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
