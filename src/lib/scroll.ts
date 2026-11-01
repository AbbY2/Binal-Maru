import type Lenis from 'lenis';

let lenis: Lenis | null = null;
let locks = 0;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
  if (instance && locks > 0) instance.stop();
};

export const lockScroll = () => {
  locks += 1;
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
};

export const unlockScroll = () => {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  lenis?.start();
  document.documentElement.style.overflow = '';
};

export const scrollToHash = (hash: string) => {
  const target = hash === '#' ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return;
  if (lenis) {
    lenis.scrollTo(target, { force: true, duration: 1.6 });
  } else if (target === 0) {
    window.scrollTo(0, 0);
  } else {
    target.scrollIntoView();
  }
};
