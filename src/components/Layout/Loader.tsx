import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Lotus } from '../ui/Lotus';
import { lockScroll, unlockScroll } from '../../lib/scroll';

const HERO_IMAGE = '/images/binal-studio.webp';
const MAX_WAIT_MS = 4000;

/** Opening breath: the sun swells while real assets load, then the page lifts away. */
export const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    lockScroll();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      unlockScroll();
      setDone(true);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCompleteRef.current();
      finish();
      return;
    }

    const image = new Image();
    image.src = HERO_IMAGE;
    const assets = Promise.race([
      Promise.all([image.decode().catch(() => undefined), document.fonts.ready]),
      new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
    ]);

    const counter = { value: 0 };
    const paint = () => {
      if (countRef.current) countRef.current.textContent = String(Math.round(counter.value));
    };

    // Climb to 80 on the inhale; the last stretch waits for the assets.
    const inhale = gsap.timeline();
    inhale
      .to(counter, { value: 80, duration: 1.3, ease: 'power1.inOut', onUpdate: paint }, 0)
      .fromTo(sunRef.current, { scale: 0.25 }, { scale: 0.85, duration: 1.3, ease: 'sine.inOut' }, 0);
    const inhaled = new Promise<void>((resolve) => inhale.eventCallback('onComplete', () => resolve()));

    let cancelled = false;
    let exit: gsap.core.Timeline | undefined;
    Promise.all([assets, inhaled]).then(() => {
      if (cancelled) return;
      exit = gsap.timeline({ onComplete: finish });
      exit
        .to(counter, { value: 100, duration: 0.35, ease: 'power1.out', onUpdate: paint }, 0)
        .to(sunRef.current, { scale: 1, duration: 0.35 }, 0)
        .to(rootRef.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 0.4)
        .add(() => onCompleteRef.current(), 0.75);
    });

    return () => {
      cancelled = true;
      inhale.kill();
      exit?.kill();
      if (!finished) {
        finished = true;
        unlockScroll();
      }
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center overflow-hidden" role="status" aria-label="Loading">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <div ref={sunRef} className="absolute inset-0 rounded-full bg-sun/90 shadow-[0_0_120px_40px_rgba(227,160,79,0.35)]" style={{ transform: 'scale(0.25)' }} />
        <Lotus draw className="relative w-24 text-umber" />
      </div>
      <p className="display italic text-2xl text-ink mt-10">Breathe in</p>
      <span className="eyebrow text-muted mt-3 tabular-nums"><span ref={countRef}>0</span>%</span>
    </div>
  );
};
