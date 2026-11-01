import { useEffect, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Lotus } from '../ui/Lotus';
import { EASE_IN_OUT, EASE_OUT } from '../../animations/shared/variants';
import { lockScroll, unlockScroll } from '../../lib/scroll';

interface NavbarProps {
  isDarkMode: boolean;
  soundEnabled: boolean;
  onToggleTheme: (e: MouseEvent<HTMLButtonElement>) => void;
  onToggleSound: () => void;
}

const navLinks = [
  { label: 'About', href: '#about-story-section' },
  { label: 'Journey', href: '#journey-timeline' },
  { label: 'Programs', href: '#programs' },
  { label: 'Poses', href: '#pose-viewer' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Stories', href: '#testimonials-section' },
  { label: 'Contact', href: '#contact' },
];

const iconButton = 'w-10 h-10 rounded-full border border-line flex items-center justify-center text-ink hover:bg-ink hover:text-bg transition-colors duration-300 cursor-pointer';

const SoundBars: React.FC<{ on: boolean }> = ({ on }) => (
  <span className="flex items-center gap-[2px] h-4" aria-hidden="true">
    {[0.5, 1, 0.7, 0.9].map((peak, i) => (
      <motion.span
        key={i}
        className="w-[2px] h-full rounded-full bg-current origin-center"
        animate={on ? { scaleY: [0.25, peak, 0.25] } : { scaleY: 0.2 }}
        transition={on ? { duration: 1 + i * 0.25, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      />
    ))}
  </span>
);

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, soundEnabled, onToggleTheme, onToggleSound }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 60);
    setHidden(y > previous && y > 240);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setActive(`#${entry.target.id}`); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !mobileOpen ? '-120%' : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="fixed top-0 inset-x-0 z-50 p-3 md:p-4"
      >
        <div className={`relative max-w-7xl mx-auto flex items-center justify-between rounded-full pl-4 pr-2 py-2 border transition-colors duration-500 overflow-hidden ${
          scrolled ? 'bg-surface/85 backdrop-blur-xl border-line shadow-lg shadow-[var(--shadow)]' : 'bg-transparent border-transparent'
        }`}>
          <a href="#" className="flex items-center gap-2.5 no-underline text-ink group" aria-label="Binal Chavda, back to top">
            <Lotus className="w-9 text-terra transition-transform duration-700 group-hover:rotate-[8deg]" />
            <span className="display text-lg whitespace-nowrap">Binal Chavda</span>
          </a>

          <nav className="hidden lg:flex items-center" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? 'true' : undefined}
                className="relative px-3.5 py-2 text-sm text-ink no-underline"
              >
                {active === link.href && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink/8" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={onToggleSound} className={iconButton} aria-label={soundEnabled ? 'Turn ambient sound off' : 'Turn ambient sound on'} aria-pressed={soundEnabled}>
              <SoundBars on={soundEnabled} />
            </button>
            <button onClick={onToggleTheme} className={iconButton} aria-label={isDarkMode ? 'Switch to day theme' : 'Switch to night theme'}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDarkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button onClick={() => setMobileOpen(true)} className={`${iconButton} lg:hidden`} aria-label="Open menu">
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
            className="absolute bottom-0 inset-x-6 h-[2px] rounded-full origin-left bg-gradient-to-r from-sun to-terra"
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 44px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
            className="fixed inset-0 z-[60] bg-umber text-cream flex flex-col justify-center px-8"
          >
            <button
              autoFocus
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full border border-cream/30 flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <span key={link.href} className="word-mask !block">
                  <motion.a
                    href={link.href}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.8, ease: EASE_OUT }}
                    onClick={() => setMobileOpen(false)}
                    className="display !inline-block text-[clamp(2.4rem,11vw,3.6rem)] text-cream no-underline"
                  >
                    {link.label}
                  </motion.a>
                </span>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
