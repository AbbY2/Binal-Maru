import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Magnetic } from '../ui/Magnetic';
import { PollenField } from '../ui/PollenField';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  ready: boolean;
  triggerHaptic: (d?: number) => void;
}

const BREATH_WORDS = ['Inhale.', 'Exhale.', 'Begin.'];

export const HeroSection: React.FC<HeroSectionProps> = ({ ready, triggerHaptic }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Scroll scene: the arch opens to fill the screen, then the page takes one breath.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const slotBox = () => {
        const slot = slotRef.current!.getBoundingClientRect();
        const pin = stickyRef.current!.getBoundingClientRect();
        return { left: slot.left - pin.left, top: slot.top - pin.top, width: slot.width, height: slot.height };
      };
      const archRadius = () => `${slotBox().width / 2}px ${slotBox().width / 2}px 0px 0px`;

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          stageRef.current,
          {
            left: () => slotBox().left,
            top: () => slotBox().top,
            width: () => slotBox().width,
            height: () => slotBox().height,
            borderRadius: archRadius,
          },
          {
            left: 0,
            top: 0,
            width: () => stickyRef.current!.clientWidth,
            height: () => stickyRef.current!.clientHeight,
            borderRadius: '0px 0px 0px 0px',
            duration: 0.42,
            ease: 'power2.inOut',
          },
          0,
        )
          .to('.hero-copy', { y: -90, opacity: 0, duration: 0.2 }, 0)
          .to('.hero-sun', { y: -220, opacity: 0, duration: 0.3 }, 0)
          .to('.hero-badge', { opacity: 0, scale: 0.6, duration: 0.12 }, 0)
          .to('.hero-photo', { scale: 1.06, duration: 1 }, 0)
          .to('.hero-shade', { opacity: 0.55, duration: 0.2 }, 0.32);

        gsap.utils.toArray<HTMLElement>('.breath-word').forEach((word, i, all) => {
          const start = 0.44 + i * 0.18;
          tl.fromTo(word, { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, duration: 0.09, ease: 'sine.out' }, start);
          if (i < all.length - 1) tl.to(word, { opacity: 0, scale: 1.12, duration: 0.07, ease: 'sine.in' }, start + 0.11);
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const place = () => gsap.set(stageRef.current, { ...slotBox(), borderRadius: archRadius() });
        place();
        window.addEventListener('resize', place);
        return () => window.removeEventListener('resize', place);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Entrance, played as the loader lifts.
  useEffect(() => {
    if (!ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.hero-reveal', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' }, 0)
        .fromTo('.hero-reveal-img', { scale: 1.35 }, { scale: 1, duration: 2.2 }, 0)
        .fromTo('.hero-sun-rise', { y: 240, opacity: 0 }, { y: 0, opacity: 1, duration: 2.2 }, 0.3)
        .fromTo('.hero-word', { yPercent: 115, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.09 }, 0.35)
        .fromTo('.hero-fade', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.12 }, 0.9)
        .fromTo('.hero-badge-in', { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 1.4, ease: 'back.out(1.6)' }, 1.2);
    }, sectionRef);
    return () => ctx.kill();
  }, [ready]);

  const word = (text: string, em?: boolean) => (
    <span className="word-mask" aria-hidden="true">
      <span className="hero-word" style={{ transformOrigin: 'left bottom' }}>{em ? <em>{text}</em> : text}</span>
    </span>
  );

  return (
    <section ref={sectionRef} id="hero" className="relative h-svh motion-safe:h-[320svh]">
      <div ref={stickyRef} className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute -top-1/4 right-[8%] w-[46vw] h-[150%] bg-gradient-to-b from-sun/35 via-sun/10 to-transparent blur-3xl animate-sunbeam pointer-events-none" />

        <div className="relative h-full max-w-7xl mx-auto px-6 pt-20 pb-6 lg:pt-24 lg:pb-0 flex flex-col lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="hero-copy relative z-20 lg:col-span-7 lg:self-center lg:pb-12">
            <span className="hero-fade eyebrow text-terra block">Binal Chavda · M.Y.A.Sc Yoga Master</span>
            <h1 aria-label="Find Your Inner Balance" className="display text-[clamp(3rem,min(7.6vw,15svh),8rem)] text-ink mt-4 lg:mt-6 !leading-[0.98]">
              {word('Find')} {word('Your')}
              <br />
              {word('Inner', true)} {word('Balance', true)}
            </h1>
            <p className="hero-fade mt-4 lg:mt-7 text-base md:text-lg text-muted max-w-md leading-relaxed">
              Certified yoga mastery meets modern practice. Personal, studio, and online sessions guided by Binal Chavda.
            </p>
            <div className="hero-fade mt-5 lg:mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#programs"
                  onClick={() => triggerHaptic(10)}
                  className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-kit-terra text-cream text-sm font-semibold no-underline shadow-lg shadow-[var(--shadow)]"
                >
                  Begin Your Practice
                  <span className="w-9 h-9 rounded-full bg-cream text-kit-terra flex items-center justify-center overflow-hidden">
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#about-story-section" className="group inline-flex items-center gap-2 px-6 py-[0.95rem] rounded-full border border-line text-ink text-sm font-semibold no-underline hover:bg-ink hover:text-bg transition-colors duration-500">
                  Explore Story
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Measured by the scroll scene; the photo itself lives in the stage below. */}
          <div className="relative flex-1 min-h-0 mt-5 lg:mt-0 lg:col-span-5 lg:h-full lg:self-end">
            <div ref={slotRef} className="absolute bottom-0 top-0 lg:top-4 left-1/2 -translate-x-1/2 w-full max-w-[min(100%,62svh)]" />
            <div className="hero-sun absolute -top-2 lg:top-0 left-1/2 -translate-x-[78%] w-[58%] max-w-[36svh] aspect-square pointer-events-none">
              <div className="hero-sun-rise w-full h-full rounded-full bg-gradient-to-br from-sun to-terra/70" />
            </div>
          </div>
        </div>

        <div ref={stageRef} className="absolute z-10 overflow-hidden" style={{ left: 0, top: 0, width: '100%', height: '100%' }}>
          <div className="hero-reveal absolute inset-0">
            <div className="hero-photo absolute inset-0">
              <img
                src="/images/binal-studio.webp"
                alt="Binal Chavda seated in prayer pose in her sunlit, plant-filled studio"
                fetchPriority="high"
                className="hero-reveal-img w-full h-full object-cover object-[52%_55%]"
              />
            </div>
            <div className="hero-shade absolute inset-0 bg-umber opacity-0" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            {BREATH_WORDS.map((w) => (
              <span key={w} className="breath-word absolute display italic text-cream text-[clamp(4rem,15vw,14rem)] opacity-0">{w}</span>
            ))}
          </div>
        </div>

        <PollenField className="absolute inset-0 w-full h-full z-[15] pointer-events-none text-sun" />

        <div className="hero-badge absolute z-20 right-[4%] bottom-[5%] w-24 h-24 lg:w-32 lg:h-32 hidden sm:block" aria-hidden="true">
          <div className="hero-badge-in w-full h-full rounded-full bg-surface/90 backdrop-blur text-ink shadow-xl shadow-[var(--shadow)]">
            <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow">
              <defs><path id="badge-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0" /></defs>
              <text fontSize="10.5" fill="currentColor" fontWeight="600">
                <textPath href="#badge-circle" textLength="272" lengthAdjust="spacing">YOGA · BREATH · BALANCE · SINCE 2016 · </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
