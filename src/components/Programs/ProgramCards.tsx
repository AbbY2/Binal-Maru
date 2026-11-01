import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Heart, Globe, Users, ArrowUpRight } from 'lucide-react';
import { ClipReveal, SectionHead } from '../ui/Reveal';

const programs = [
  {
    id: 'ins_personal',
    title: 'Private Alignment',
    subtitle: '1-on-1 Therapeutic Yoga',
    tag: 'Premium',
    icon: Heart,
    image: '/images/binal-personal.webp',
    alt: 'Binal in a seated backbend during a private practice',
    position: '60% 50%',
    description: 'Bespoke custom-sequenced yoga alignment and posture therapy tailored to your body. Ideal for injury recovery, athletic flow mastery, or deep personal practice.',
    highlights: ['Postural Correction', 'Pranayama Regulation', 'Remote HD Streams'],
    color: 'bg-kit-sage',
  },
  {
    id: 'ins_offline',
    title: 'Studio Sessions',
    subtitle: 'Group Classes in Gandhinagar',
    tag: 'In-Person',
    icon: Users,
    image: '/images/binal-studio.webp',
    alt: 'Binal seated in prayer pose in the Gandhinagar studio',
    position: '52% 55%',
    description: 'Classical face-to-face masterclasses emphasizing traditional Hatha foundations, deep bandhas, and collective energy.',
    highlights: ['Hands-on Adjustment', 'Traditional Hatha', 'Yoga Sutra Study'],
    color: 'bg-kit-terra',
  },
  {
    id: 'ins_online',
    title: 'Global Online',
    subtitle: 'Virtual Sanctuary',
    tag: 'Remote',
    icon: Globe,
    image: '/images/binal-online.webp',
    alt: 'Binal demonstrating an extended side-angle pose',
    position: '45% 50%',
    description: 'High-definition live streams and guided breathwork courses for students worldwide. Yoga Nidra, Yin restoration, and coherence practices.',
    highlights: ['Live HD Streams', 'Breathwork Coaching', 'Custom Timing'],
    color: 'bg-kit-plum',
  },
];

interface CardProps {
  program: (typeof programs)[number];
  index: number;
  progress: MotionValue<number>;
  onSelect: (id: string) => void;
}

const ProgramCard: React.FC<CardProps> = ({ program: p, index, progress, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const shrink = useTransform(progress, [index / programs.length, 1], [1, 1 - (programs.length - index - 1) * 0.045]);

  return (
    <div
      ref={ref}
      className="pin:sticky pin:h-[82svh] mb-6 pin:mb-[7svh]"
      style={{ zIndex: index, top: `calc(9svh + ${index * 14}px)` }}
    >
      <motion.article
        style={{ scale: shrink }}
        className={`relative pin:h-full origin-top rounded-[2rem] md:rounded-[2.5rem] ${p.color} text-cream overflow-hidden grid grid-cols-1 pin:grid-cols-12 shadow-2xl shadow-[var(--shadow)]`}
      >
        <div className="relative pin:col-span-7 p-7 md:p-12 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="w-12 h-12 rounded-full border border-cream/35 flex items-center justify-center">
              <p.icon className="w-5 h-5" />
            </span>
            <span className="eyebrow !text-[0.7rem] px-3 py-1.5 rounded-full border border-cream/35">{p.tag}</span>
          </div>

          <div className="pin:mt-auto mt-10">
            <span className="display italic text-xl text-cream/85">{p.subtitle}</span>
            <h3 className="display text-[clamp(2.6rem,5.6vw,5rem)] mt-1">{p.title}</h3>
            <p className="text-base md:text-lg text-cream/90 leading-relaxed mt-4 max-w-lg">{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {p.highlights.map((h) => (
                <span key={h} className="text-sm px-3 py-1.5 rounded-full bg-cream/12">{h}</span>
              ))}
            </div>
            <button
              onClick={() => onSelect(p.id)}
              className="group mt-7 inline-flex items-center gap-3 pl-5 pr-1.5 py-1.5 rounded-full bg-cream text-umber text-sm font-semibold cursor-pointer"
            >
              Learn more
              <span className="w-8 h-8 rounded-full bg-umber text-cream flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </button>
          </div>
        </div>

        <ClipReveal className="relative pin:col-span-5 h-80 pin:h-auto mx-7 pin:mx-0 pin:mt-8 pin:mr-8 overflow-hidden arch self-stretch">
          <motion.img
            style={{ scale: photoScale, objectPosition: p.position }}
            src={p.image}
            alt={p.alt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </ClipReveal>
      </motion.article>
    </div>
  );
};

export const ProgramCards: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="programs" className="relative z-10 bg-bg pt-24 md:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHead
          eyebrow="Offerings"
          title={['Practice', { em: 'With Purpose' }]}
          sub="Three ways to work with Binal — whether across the mat or across the world."
          center
          className="mb-14 md:mb-20 px-2"
        />
        <div ref={stackRef}>
          {programs.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} progress={scrollYProgress} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
};
