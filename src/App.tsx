import { useEffect, useLayoutEffect, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroSection } from './components/Hero/HeroSection';
import { AboutSection } from './components/About/AboutSection';
import { JourneyTimeline } from './components/Journey/JourneyTimeline';
import { ProgramCards } from './components/Programs/ProgramCards';
import { YogaPoseViewer } from './components/PoseViewer/YogaPoseViewer';
import { GallerySection } from './components/Gallery/GallerySection';
import { TestimonialsSection } from './components/Testimonials/TestimonialsSection';
import { StatsCounter } from './components/Stats/StatsCounter';
import { CertificateCarousel } from './components/Certificates/CertificateCarousel';
import { FAQAccordion } from './components/FAQ/FAQAccordion';
import { ContactForm } from './components/Contact/ContactForm';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { CustomCursor } from './components/Layout/Cursor';
import { Loader } from './components/Layout/Loader';
import { globalSoundscape } from './components/sound/SoundscapeEngine';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { lockScroll, unlockScroll } from './lib/scroll';
import { EASE_OUT } from './animations/shared/variants';
import { YogaInstructor } from './types';
import { X, Award, ArrowRight } from 'lucide-react';

const instructors: YogaInstructor[] = [
  {
    id: 'ins_personal', name: 'Personal Training (1-on-1)', specialty: 'Personal Yoga Trainer',
    bio: 'Bespoke custom-sequenced yoga alignment and posture therapy.',
    longBio: 'Binal Chavda holds a Master in Yoga (M.Y.A.Sc) and is a certified Professional & Personal Yoga Trainer. In her Personal Alignment Programs, Binal provides bespoke posture correction, private therapeutic Hatha instructions, and custom prana regulation.',
    image: '/images/binal-personal.webp',
    certifications: ['M.Y.A.Sc (Master in Yoga)', 'Certified Professional & Personal Yoga Trainer', 'Holistic Life Coach'],
    styles: ['Hatha Alignment', 'Therapeutic Yoga', 'Postural Adjustment', 'Pranayama'],
    soundTheme: 'deep_peace', experienceYears: 8
  },
  {
    id: 'ins_offline', name: 'Gandhinagar Studio Practice', specialty: 'Offline Studio Master',
    bio: 'Classical offline group classes and hands-on workshops.',
    longBio: 'Binal Chavda leads classical face-to-face masterclasses in Gandhinagar, bringing physical presence and collective energy together. Her offline studio classes emphasize traditional Hatha foundations, deep bandhas, and core prana control.',
    image: '/images/binal-studio.webp',
    certifications: ['M.Y.A.Sc (Master in Yoga)', 'Experienced Studio Lead & Academic Lecturer', 'Traditional Hatha & Yoga Sutra Expert'],
    styles: ['Ashtanga Vinyasa', 'Somatic Alignment', 'Traditional Hatha', 'Pranayama Sutras'],
    soundTheme: 'cosmic_dawn', experienceYears: 8
  },
  {
    id: 'ins_online', name: 'Global Virtual Sanctuary', specialty: 'Online Classes & Flows',
    bio: 'Interactive high-definition digital streams for students worldwide.',
    longBio: 'Through her Global Online Sanctuary, Binal Chavda brings high-definition live streams and guided breathwork courses directly to students worldwide. This virtual space provides deep vagus nerve down-regulation, gentle restorative Yin holds.',
    image: '/images/binal-online.webp',
    certifications: ['M.Y.A.Sc (Master in Yoga)', 'Online Virtual Streaming Wellness Specialist', 'Advanced Breathwork & Coherence Facilitator'],
    styles: ['Vinyasa Flow', 'Yin Restoration', 'Coherent Breathing', 'Yoga Nidra'],
    soundTheme: 'ethereal_flow', experienceYears: 8
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('yoga_binal_theme') === 'dark';
    } catch { return false; }
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<YogaInstructor | null>(null);
  const [ready, setReady] = useState(false);

  useSmoothScroll();

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try { localStorage.setItem('yoga_binal_theme', isDarkMode ? 'dark' : 'light'); } catch {}
  }, [isDarkMode]);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  const isOverlayOpen = selectedInstructor !== null;
  useEffect(() => {
    if (!isOverlayOpen) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedInstructor(null); };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [isOverlayOpen]);

  const triggerHaptic = (duration = 15) => {
    try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(duration); } catch {}
  };

  const handleToggleSound = async () => {
    triggerHaptic(soundEnabled ? 15 : 20);
    if (soundEnabled) {
      globalSoundscape.stop();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(await globalSoundscape.start());
    }
  };

  const handleToggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
    triggerHaptic(12);
    const next = !isDarkMode;
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsDarkMode(next);
      return;
    }
    const { clientX: x, clientY: y } = e;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => flushSync(() => setIsDarkMode(next))).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <Loader onComplete={() => setReady(true)} />

      <div className="min-h-screen bg-bg text-ink overflow-x-clip grain">
        <CustomCursor />
        <Navbar
          isDarkMode={isDarkMode}
          soundEnabled={soundEnabled}
          onToggleTheme={handleToggleTheme}
          onToggleSound={handleToggleSound}
        />

        <main>
          <HeroSection ready={ready} triggerHaptic={triggerHaptic} />
          <AboutSection />
          <JourneyTimeline />
          <ProgramCards onSelect={(id) => setSelectedInstructor(instructors.find((i) => i.id === id) ?? null)} />
          <YogaPoseViewer />
          <StatsCounter />
          <GallerySection />
          <TestimonialsSection />
          <CertificateCarousel />
          <FAQAccordion />
          <ContactForm />
        </main>

        <Footer />

        {/* Program detail overlay */}
        <AnimatePresence>
          {selectedInstructor && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedInstructor.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-lenis-prevent
              className="fixed inset-0 z-[70] overflow-y-auto bg-umber/70 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-10"
            >
              <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedInstructor(null)} />
              <motion.div
                initial={{ opacity: 0, y: 70, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.98 }}
                transition={{ duration: 0.75, ease: EASE_OUT }}
                className="relative w-full max-w-4xl bg-surface rounded-[2rem] overflow-hidden shadow-2xl z-10 flex flex-col lg:flex-row"
              >
                <button
                  autoFocus
                  onClick={() => setSelectedInstructor(null)}
                  className="absolute top-4 right-4 w-11 h-11 rounded-full bg-ink text-bg flex items-center justify-center z-20 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="lg:w-5/12 h-[280px] lg:h-auto relative overflow-hidden lg:m-5 lg:mr-0 lg:rounded-t-full">
                  <motion.img
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.4, ease: EASE_OUT }}
                    src={selectedInstructor.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-[55%_50%]"
                  />
                </div>

                <div className="lg:w-7/12 p-7 md:p-9 flex flex-col gap-5">
                  <div className="pr-10">
                    <span className="eyebrow text-terra">{selectedInstructor.specialty}</span>
                    <h3 className="display text-4xl text-ink mt-2">{selectedInstructor.name}</h3>
                  </div>
                  <p className="text-base text-muted leading-relaxed">{selectedInstructor.longBio}</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedInstructor.styles.map((style) => (
                      <span key={style} className="px-3 py-1.5 rounded-full text-sm border border-line text-ink">{style}</span>
                    ))}
                  </div>

                  <div className="border-t border-line pt-4">
                    <span className="eyebrow text-muted">Credentials</span>
                    <div className="flex flex-col gap-2 mt-3">
                      {selectedInstructor.certifications.map((cert) => (
                        <div key={cert} className="flex items-center gap-2.5 text-sm text-ink">
                          <Award className="w-4 h-4 text-terra shrink-0" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#contact"
                    onClick={() => setSelectedInstructor(null)}
                    className="group self-start inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-kit-terra text-cream text-sm font-semibold no-underline"
                  >
                    Book Session
                    <span className="w-9 h-9 rounded-full bg-cream text-kit-terra flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
