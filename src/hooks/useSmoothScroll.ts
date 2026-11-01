import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToHash, setLenis } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    // The loader always opens on the hero, so a restored scroll position would only jump.
    history.scrollRestoration = 'manual';

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const instance = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      instance.on('scroll', ScrollTrigger.update);
      tick = (time) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
      lenis = instance;
    }

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      scrollToHash(link.getAttribute('href') || '#');
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
}
