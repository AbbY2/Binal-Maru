import { useEffect, useRef } from 'react';

/** Dust motes drifting through the sunlight. Sleeps when off screen. */
export const PollenField: React.FC<{ className?: string; count?: number }> = ({ className, count = 46 }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.9,
      speed: 0.006 + Math.random() * 0.016,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let last = performance.now();
    let visible = true;
    const color = getComputedStyle(canvas).color;
    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      for (const m of motes) {
        m.y -= m.speed * dt;
        if (m.y < -0.02) m.y = 1.02;
        ctx.globalAlpha = 0.3 + 0.55 * (0.5 + 0.5 * Math.sin(now * 0.0009 + m.phase));
        ctx.beginPath();
        ctx.arc((m.x + Math.sin(now * 0.00025 + m.phase) * 0.018) * width, m.y * height, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = performance.now();
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(render);
      }
    });
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
};
