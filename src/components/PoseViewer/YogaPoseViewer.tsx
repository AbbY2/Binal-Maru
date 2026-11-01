import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHead, FadeUp } from '../ui/Reveal';
import { Lotus } from '../ui/Lotus';
import { EASE_OUT } from '../../animations/shared/variants';
import { poses } from './poses';

const PoseScene = lazy(() => import('./PoseScene'));

const AUTOPLAY_MS = 7000;

const SceneFallback: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center text-terra">
    <Lotus className="w-20 animate-breathe" />
  </div>
);

// WebGL can be unavailable on some devices; the rest of the page must survive that.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children; }
}

export const YogaPoseViewer: React.FC = () => {
  const [poseIndex, setPoseIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const near = useInView(stageRef, { once: true, margin: '600px 0px' });
  const visible = useInView(stageRef);

  useEffect(() => {
    if (!autoplay || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setPoseIndex((i) => (i + 1) % poses.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplay, visible]);

  const choose = (index: number) => {
    setAutoplay(false);
    setPoseIndex((index + poses.length) % poses.length);
  };
  const pose = poses[poseIndex];

  return (
    <section id="pose-viewer" className="relative z-10 bg-bg py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead eyebrow="Interactive 3D" title={['Yoga Pose', { em: 'Explorer' }]} center className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <FadeUp className="lg:col-span-7">
            <div ref={stageRef} data-cursor="Drag" className="relative h-[440px] md:h-[600px] arch overflow-hidden bg-gradient-to-b from-sun/30 via-surface to-surface border border-line border-b-0">
              <div className="absolute left-[21%] top-[14%] w-[58%] aspect-square rounded-full bg-sun/30 blur-2xl animate-breathe" />
              <SceneBoundary>
                <Suspense fallback={<SceneFallback />}>
                  {near && <PoseScene poseIndex={poseIndex} active={visible} />}
                </Suspense>
              </SceneBoundary>
            </div>
          </FadeUp>

          <div className="lg:col-span-5 flex flex-col">
            <div className="min-h-[13.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pose.name}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  <span className="display italic text-xl text-terra">{pose.name}</span>
                  <h3 className="display text-[clamp(2.2rem,4vw,3.4rem)] text-ink mt-1">{pose.label}</h3>
                  <p className="text-base text-muted leading-relaxed mt-4">{pose.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col mt-4" role="group" aria-label="Choose a pose">
              {poses.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => choose(i)}
                  aria-pressed={i === poseIndex}
                  className="group relative flex items-center gap-4 py-2.5 text-left border-t border-line cursor-pointer"
                >
                  <span className={`text-sm tabular-nums ${i === poseIndex ? 'text-terra font-semibold' : 'text-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`text-base transition-transform duration-500 group-hover:translate-x-1 ${i === poseIndex ? 'text-ink font-semibold' : 'text-muted'}`}>{p.label}</span>
                  {i === poseIndex && (
                    <motion.span
                      layoutId="pose-marker"
                      className="absolute -top-px left-0 h-[2px] w-full bg-terra"
                      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2.5 mt-5">
              <button onClick={() => choose(poseIndex - 1)} aria-label="Previous pose" className="w-12 h-12 rounded-full border border-line text-ink flex items-center justify-center hover:bg-ink hover:text-bg transition-colors duration-300 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={() => choose(poseIndex + 1)} className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-kit-terra text-cream text-sm font-semibold cursor-pointer">
                Next Pose <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
