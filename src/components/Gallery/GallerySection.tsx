import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHead } from '../ui/Reveal';
import { EASE_IN_OUT, EASE_OUT } from '../../animations/shared/variants';
import { lockScroll, unlockScroll } from '../../lib/scroll';

interface GalleryItem {
  src: string;
  alt: string;
  tag: string;
  shape: string;
  focus: string;
  zoom?: number;
}

const galleryItems: GalleryItem[] = [
  { src: '/images/binal-studio.webp', alt: 'Binal Chavda in prayer pose in her plant-filled studio', tag: 'Studio', shape: 'aspect-[4/5] arch', focus: '52% 55%' },
  { src: '/images/binal-studio.webp', alt: 'Close view of hands joined in prayer', tag: 'Practice', shape: 'aspect-square rounded-3xl', focus: '47% 56%', zoom: 2.4 },
  { src: '/images/binal-personal.webp', alt: 'Binal in a seated backbend on a cork mat', tag: 'Portrait', shape: 'aspect-[4/5] rounded-3xl', focus: '58% 52%' },
  { src: '/images/binal-studio.webp', alt: 'Singing bowl and lit candles on a low wooden table', tag: 'Ritual', shape: 'aspect-square rounded-full', focus: '100% 90%', zoom: 2.6 },
  { src: '/images/binal-online.webp', alt: 'Binal reaching skyward in an extended side-angle pose', tag: 'Online', shape: 'aspect-[4/5] arch', focus: '44% 45%' },
  { src: '/images/binal-studio.webp', alt: 'Morning light through the arched studio window', tag: 'Light', shape: 'aspect-square rounded-3xl', focus: '8% 20%', zoom: 2.2 },
];

const COLUMNS = [[0, 3], [1, 2], [4, 5]];

const photoStyle = (item: GalleryItem) => ({
  objectPosition: item.focus,
  transformOrigin: item.focus,
  transform: item.zoom ? `scale(${item.zoom})` : undefined,
});

const Tile: React.FC<{ index: number; onOpen: (i: number) => void }> = ({ index, onOpen }) => {
  const item = galleryItems[index];
  return (
    <motion.button
      onClick={() => onOpen(index)}
      data-cursor="View"
      aria-label={`Open photo: ${item.alt}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-6% 0px' }}
      className={`group relative block w-full overflow-hidden cursor-pointer ${item.shape}`}
    >
      <motion.span
        variants={{
          hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
          shown: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.3, ease: EASE_IN_OUT, delay: (index % 3) * 0.08 } },
        }}
        className="absolute inset-0 overflow-hidden"
      >
        <span className="absolute inset-0 overflow-hidden transition-transform duration-[1400ms] ease-out group-hover:scale-110">
          <img src={item.src} alt="" loading="lazy" className="w-full h-full object-cover" style={photoStyle(item)} />
        </span>
      </motion.span>
      <span className="absolute left-1/2 bottom-4 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-500 eyebrow !text-[0.7rem] text-umber bg-cream px-3 py-1.5 rounded-full">
        {item.tag}
      </span>
    </motion.button>
  );
};

const Column: React.FC<{ indexes: number[]; y: MotionValue<string>; className?: string; onOpen: (i: number) => void }> = ({ indexes, y, className = '', onOpen }) => (
  <motion.div style={{ y }} className={`flex flex-col gap-4 md:gap-6 ${className}`}>
    {indexes.map((i) => <Tile key={i} index={i} onOpen={onOpen} />)}
  </motion.div>
);

export const GallerySection: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'end start'] });
  const fast = useTransform(scrollYProgress, [0, 1], ['7%', '-7%']);
  const slow = useTransform(scrollYProgress, [0, 1], ['-5%', '6%']);

  const step = useCallback((delta: number) => {
    setSelected((s) => (s === null ? s : (s + delta + galleryItems.length) % galleryItems.length));
  }, []);

  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, step]);

  const active = selected === null ? null : galleryItems[selected];
  const control = 'absolute z-10 w-12 h-12 rounded-full bg-cream text-umber flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300';

  return (
    <section id="gallery" className="relative z-10 bg-bg py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead eyebrow="Moments" title={['Visual', { em: 'Gallery' }]} center className="mb-14 md:mb-20" />

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Column indexes={COLUMNS[0]} y={fast} onOpen={setSelected} />
          <Column indexes={COLUMNS[1]} y={slow} className="md:mt-16" onOpen={setSelected} />
          <Column indexes={COLUMNS[2]} y={fast} className="col-span-2 md:col-span-1 max-md:!flex-row" onOpen={setSelected} />
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-umber/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelected(null)}
          >
            <button autoFocus onClick={() => setSelected(null)} className={`${control} top-5 right-5`} aria-label="Close photo">
              <X className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); step(-1); }} className={`${control} left-3 md:left-6`} aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); step(1); }} className={`${control} right-3 md:right-6`} aria-label="Next photo">
              <ChevronRight className="w-5 h-5" />
            </button>
            <motion.figure
              key={selected}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-4"
            >
              <div className="overflow-hidden rounded-3xl w-[min(70vw,76svh)] aspect-square">
                <img src={active.src} alt={active.alt} className="w-full h-full object-cover" style={photoStyle(active)} />
              </div>
              <figcaption className="text-cream/90 text-sm text-center max-w-[70vw]">{active.alt}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
