import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { GraduationCap, Users, MapPin, ArrowRight } from 'lucide-react';
import { ClipReveal, FadeUp, RevealText, ScrubText } from '../ui/Reveal';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [-50, 110]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [50, -60]);
  const badgeY2 = useTransform(scrollYProgress, [0, 1], [-20, 50]);

  return (
    <section id="about-story-section" ref={sectionRef} className="relative z-20 bg-bg -mt-[5svh] rounded-t-[50%_5svh] pt-28 pb-24 md:pt-40 md:pb-36">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
        <div className="lg:col-span-5 relative max-w-md mx-auto lg:max-w-none w-full">
          <motion.svg style={{ rotate: ringRotate }} viewBox="0 0 200 200" className="absolute -left-[9%] -top-[6%] w-[118%] h-auto text-sun pointer-events-none" aria-hidden="true">
            <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 5" />
          </motion.svg>

          <ClipReveal className="relative aspect-[4/5] overflow-hidden arch">
            <motion.img
              style={{ y: photoY, scale: 1.2 }}
              src="/images/binal-personal.webp"
              alt="Binal Chavda holding a seated backbend on a cork mat"
              loading="lazy"
              className="w-full h-full object-cover object-[60%_50%]"
            />
          </ClipReveal>

          <motion.div style={{ y: badgeY }} className="absolute -bottom-4 -right-2 md:-right-8 bg-surface p-4 rounded-2xl shadow-xl shadow-[var(--shadow)] flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-sage" />
            <div>
              <span className="block display text-2xl text-ink">8+ yrs</span>
              <span className="text-xs text-muted">Certified teaching</span>
            </div>
          </motion.div>

          <motion.div style={{ y: badgeY2 }} className="absolute top-[38%] -left-2 md:-left-10 bg-surface p-4 rounded-2xl shadow-xl shadow-[var(--shadow)] flex items-center gap-3">
            <MapPin className="w-6 h-6 text-terra" />
            <div>
              <span className="block display text-lg text-ink">Gandhinagar</span>
              <span className="text-xs text-muted">+ Worldwide online</span>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          <FadeUp y={12}><span className="eyebrow text-terra">Her Story</span></FadeUp>
          <RevealText
            segments={['From Ancient Sutras to', { em: 'Modern Practice' }]}
            className="display text-[clamp(2.6rem,6vw,5.2rem)] text-ink mt-4"
          />

          <ScrubText
            className="display !leading-snug !tracking-normal text-[clamp(1.25rem,2.1vw,1.7rem)] text-ink mt-9"
            text="Binal Chavda holds a Master's degree in Yoga (M.Y.A.Sc) and has spent the last eight years turning a lifelong study of the yogic sutras into a practice that meets modern bodies where they are — hunched over laptops, recovering from injury, or simply looking for ten quiet minutes in a loud day."
          />

          <FadeUp className="mt-7 flex flex-col gap-4 max-w-2xl">
            <p className="text-base text-muted leading-relaxed">
              What started as classical Hatha instruction in a single Gandhinagar studio has grown into three distinct ways of working with her: private one-on-one alignment for people healing from injury or chasing a specific goal, in-person studio classes built on traditional bandhas and postural discipline, and a fully remote sanctuary for students anywhere in the world who want real breathwork coaching without leaving home.
            </p>
            <p className="text-base text-muted leading-relaxed">
              Across all three, the throughline is the same: yoga taught with an academic's precision and a therapist's patience, not just a sequence of poses to copy.
            </p>
          </FadeUp>

          <div className="flex flex-wrap gap-2.5 mt-8">
            {[
              { icon: Users, label: 'Personal & group' },
              { icon: GraduationCap, label: 'M.Y.A.Sc certified' },
              { icon: MapPin, label: 'In-person & online' },
            ].map((item, i) => (
              <FadeUp key={item.label} delay={i * 0.1} y={16}>
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-line text-sm text-ink">
                  <item.icon className="w-4 h-4 text-sage shrink-0" /> {item.label}
                </span>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <a href="#journey-timeline" className="group inline-flex items-center gap-2 mt-9 text-base font-semibold text-terra no-underline">
              View my journey
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};
