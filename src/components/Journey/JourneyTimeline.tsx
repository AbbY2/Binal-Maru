import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE_OUT } from '../../animations/shared/variants';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: '2016', title: 'The Root', subtitle: 'Entered Yogic Academia', detail: 'Binal began her formal yogic education, studying classical Hatha foundations, Sanskrit sutras, and the eight limbs of Patanjali at university level in Gandhinagar.' },
  { year: '2018', title: 'Certification', subtitle: 'M.Y.A.Sc Earned', detail: 'Graduated with a Master of Yoga, one of the highest academic credentials in the field. Began teaching private alignment sessions from a small studio.' },
  { year: '2020', title: 'Digital Pivot', subtitle: 'Virtual Sanctuary Opened', detail: 'Launched high-definition online streams spanning 12+ countries. What began as a stopgap became a permanent global offering.' },
  { year: '2022', title: 'Studio Hub', subtitle: 'Gandhinagar Studio', detail: 'Expanded to a dedicated physical studio space offering group Hatha, Ashtanga Vinyasa, and specialized therapeutic workshops.' },
  { year: '2024', title: 'Global Reach', subtitle: '1K+ Students Served', detail: 'Crossed 1,000 unique students across all three modalities. Launched coherent breathwork protocols with biofeedback integration.' },
  { year: '2026', title: 'Full Circle', subtitle: 'Holistic Life Coach', detail: 'Founded Binal Chavda Holistic — bridging academic yoga, nervous-system regulation, and modern wellness design.' },
];

const PIN_QUERY = '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';
const STACK_QUERY = '((max-width: 1023px) or (max-height: 699px)) and (prefers-reduced-motion: no-preference)';

export const JourneyTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [yearIndex, setYearIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const sky = (scrollTrigger: ScrollTrigger.Vars) =>
        gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger })
          .to('.sky-noon', { opacity: 1, duration: 1 })
          .to('.sky-dusk', { opacity: 1, duration: 1 });

      // Desktop: the track slides sideways while the sun crosses the sky above it.
      mm.add(PIN_QUERY, () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const length = () => `+=${distance() * 1.25}`;

        const slide = gsap.to(track, { x: () => -distance(), ease: 'none' });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: length,
          pin: true,
          scrub: 0.8,
          animation: slide,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress;
            gsap.set('.journey-sun', { left: `${2 + 96 * t}%`, top: `${92 - 84 * Math.sin(Math.PI * t)}%` });
            gsap.set('.journey-trail', { strokeDashoffset: 1 - t });
            setYearIndex(Math.min(milestones.length - 1, Math.floor(t * milestones.length)));
          },
        });

        sky({ trigger: sectionRef.current, start: 'top top', end: length, scrub: 0.8 });

        track.querySelectorAll('.journey-card').forEach((card) => {
          gsap.fromTo(card,
            { opacity: 0, y: 70, rotate: 2.5 },
            {
              opacity: 1, y: 0, rotate: 0, ease: 'power2.out',
              scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 96%', end: 'left 62%', scrub: true },
            },
          );
        });
      });

      // Phones and short screens: the same path, read top to bottom.
      mm.add(STACK_QUERY, () => {
        sky({ trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true });
        gsap.fromTo('.journey-rail', { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: trackRef.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
        });
        gsap.utils.toArray<HTMLElement>('.journey-card').forEach((card) => {
          gsap.from(card, { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey-timeline" ref={sectionRef} className="relative z-10 text-cream overflow-hidden pin:h-svh bg-[#2c2233]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c2233] via-[#5c3a47] to-[#b8683f]" />
      <div className="sky-noon absolute inset-0 opacity-0 bg-gradient-to-b from-[#3b2a33] via-[#8a4a2e] to-[#d9914a]" />
      <div className="sky-dusk absolute inset-0 opacity-0 bg-gradient-to-b from-[#14100d] via-[#2b1d19] to-[#6b3f2b]" />

      {/* Sun path */}
      <div className="hidden pin:block absolute inset-x-[4%] top-[9%] h-[46%] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
          <path d="M20 460 A 480 420 0 0 1 980 460" fill="none" stroke="#fbf4e6" strokeOpacity="0.28" strokeWidth="1.2" strokeDasharray="2 8" vectorEffect="non-scaling-stroke" />
          <path className="journey-trail" d="M20 460 A 480 420 0 0 1 980 460" fill="none" stroke="#f0b565" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        </svg>
        <div className="journey-sun absolute w-14 h-14 -ml-7 -mt-7 rounded-full bg-gradient-to-br from-[#ffd891] to-[#e3a04f] shadow-[0_0_70px_26px_rgba(240,181,101,0.55)]" style={{ left: '2%', top: '92%' }} />
        <div className="absolute inset-x-0 bottom-[3%] flex justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={milestones[yearIndex].year}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 0.95 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="display text-[clamp(4rem,11svh,7.5rem)]"
            >
              {milestones[yearIndex].year}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative pin:absolute pin:top-0 pin:left-0 z-20 px-6 pt-24 pb-10 pin:pl-[6vw] pin:pb-0 pin:max-w-sm">
        <span className="eyebrow text-[#f0b565]">The Path</span>
        <h2 className="display text-[clamp(2.6rem,5vw,4.5rem)] mt-3">My <em>Journey</em></h2>
        <p className="text-base text-cream/80 mt-3 max-w-md leading-relaxed">
          Follow the sun from academic foundations to a global holistic practice.
        </p>
      </div>

      <div className="relative pin:absolute pin:inset-x-0 pin:bottom-[5svh]">
        <div className="pin:hidden absolute left-[2.1rem] top-2 bottom-20 w-px bg-cream/20" aria-hidden="true">
          <div className="journey-rail absolute inset-0 origin-top bg-[#f0b565]" />
        </div>

        <div ref={trackRef} className="flex flex-col pin:flex-row pin:w-max gap-5 pin:gap-6 pl-14 pr-6 pb-20 pin:pb-0 pin:pl-[34vw] pin:pr-[12vw] will-change-transform">
          {milestones.map((m) => (
            <article key={m.year} className="journey-card relative pin:w-[390px] shrink-0 p-6 rounded-3xl bg-black/30 backdrop-blur-md border border-cream/15">
              <span className="pin:hidden absolute -left-[1.42rem] top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f0b565]" aria-hidden="true" />
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="display text-3xl">{m.title}</h3>
                <span className="display italic text-xl text-[#f0b565]">{m.year}</span>
              </div>
              <span className="eyebrow !text-[0.7rem] text-cream/80 mt-2 block">{m.subtitle}</span>
              <p className="text-[0.95rem] text-cream/85 leading-relaxed mt-3">{m.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
