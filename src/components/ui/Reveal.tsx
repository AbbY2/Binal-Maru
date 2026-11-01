import { createElement, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { EASE_IN_OUT, EASE_OUT } from '../../animations/shared/variants';

type Segment = string | { em: string };

interface RevealTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  segments: Segment[];
  className?: string;
  delay?: number;
}

/** Heading whose words rise one by one from behind a mask when scrolled into view. */
export const RevealText: React.FC<RevealTextProps> = ({ as = 'h2', segments, className, delay = 0 }) => {
  const words = segments.flatMap((segment) => {
    const em = typeof segment !== 'string';
    const text = em ? segment.em : segment;
    return text.split(' ').filter(Boolean).map((word) => ({ word, em }));
  });
  const label = words.map((w) => w.word).join(' ');

  return createElement(
    as,
    { className, 'aria-label': label },
    words.map(({ word, em }, i) => (
      <span key={i} aria-hidden="true">
        <span className="word-mask">
          <motion.span
            initial={{ y: '115%', rotate: 4 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 1, ease: EASE_OUT, delay: delay + i * 0.055 }}
          >
            {em ? <em>{word}</em> : word}
          </motion.span>
        </span>{' '}
      </span>
    )),
  );
};

export const FadeUp: React.FC<{ children: ReactNode; delay?: number; className?: string; y?: number }> = ({
  children, delay = 0, className, y = 28,
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-8% 0px' }}
    transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * Wipes its children up from the bottom edge. The in-view check sits on the unclipped
 * parent because browsers report a fully clipped element as not intersecting.
 */
export const ClipReveal: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => (
  <motion.div className={className} initial="hidden" whileInView="shown" viewport={{ once: true, margin: '-10% 0px' }}>
    <motion.div
      className="absolute inset-0"
      variants={{
        hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
        shown: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.5, ease: EASE_IN_OUT, delay } },
      }}
    >
      {children}
    </motion.div>
  </motion.div>
);

const ScrubWord: React.FC<{ word: string; progress: MotionValue<number>; range: [number, number] }> = ({ word, progress, range }) => {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
};

/** Paragraph that "inks in" word by word as it moves up the screen. */
export const ScrubText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 55%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <ScrubWord key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
};

interface SectionHeadProps {
  eyebrow: string;
  title: Segment[];
  sub?: string;
  center?: boolean;
  className?: string;
}

export const SectionHead: React.FC<SectionHeadProps> = ({ eyebrow, title, sub, center, className = '' }) => (
  <div className={`${center ? 'text-center' : ''} ${className}`}>
    <FadeUp y={12}>
      <span className="eyebrow text-terra">{eyebrow}</span>
    </FadeUp>
    <RevealText segments={title} className="display text-[clamp(2.6rem,6.4vw,5.5rem)] text-ink mt-4" />
    {sub && (
      <FadeUp delay={0.25}>
        <p className={`text-base md:text-lg text-muted mt-5 leading-relaxed ${center ? 'max-w-xl mx-auto' : 'max-w-lg'}`}>{sub}</p>
      </FadeUp>
    )}
  </div>
);
