import { Star, Quote } from 'lucide-react';
import { SectionHead, FadeUp } from '../ui/Reveal';

interface Testimonial {
  id: string;
  name: string;
  program: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  { id: 't1', name: 'Priya S.', program: 'Personal Training', quote: "Binal noticed a shoulder imbalance in my very first session that two physiotherapists had missed. Three months of her personal alignment work and I'm finally pain-free.", rating: 5 },
  { id: 't2', name: 'Rohan M.', program: 'Studio Practice', quote: "The studio classes are unlike any gym yoga I've tried. Binal actually corrects your posture hands-on, and the group energy on Sunday mornings has become the best part of my week.", rating: 5 },
  { id: 't3', name: 'Emma L.', program: 'Virtual Sanctuary', quote: "I stream in from London at 6am my time and it's worth every minute. Her breathwork sessions genuinely lowered my resting heart rate — I track it, so I know it's real.", rating: 5 },
  { id: 't4', name: 'Kavya D.', program: 'Personal Training', quote: "I came to Binal after a back injury scared me away from movement entirely. She rebuilt my confidence pose by pose. Eight months later I can do things I never could pre-injury.", rating: 5 },
  { id: 't5', name: 'James T.', program: 'Virtual Sanctuary', quote: "The Yoga Nidra sessions are the only thing that's worked for my racing-mind insomnia. Simple as that. I've recommended this to half my office.", rating: 5 },
  { id: 't6', name: 'Ananya P.', program: 'Studio Practice', quote: "Binal's academic grounding in yoga sutras comes through in how she teaches — it's never just poses, there's always a 'why'. That depth kept me coming back for two years.", rating: 5 },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <figure className="relative w-[320px] md:w-[420px] shrink-0 mx-3 p-7 rounded-3xl bg-surface border border-line flex flex-col gap-4 transition-transform duration-500 hover:-translate-y-1.5">
    <Quote className="absolute top-6 right-6 w-8 h-8 text-sun/50" aria-hidden="true" />
    <div className="flex gap-0.5" role="img" aria-label={`Rated ${testimonial.rating} out of 5`}>
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-sun text-sun" />
      ))}
    </div>
    <blockquote className="display !tracking-normal !leading-snug text-lg md:text-xl text-ink">
      &ldquo;{testimonial.quote}&rdquo;
    </blockquote>
    <figcaption className="flex items-center gap-3 mt-auto pt-2">
      <span className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center display text-lg text-sage shrink-0">{testimonial.name.charAt(0)}</span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-ink">{testimonial.name}</span>
        <span className="text-sm text-muted">{testimonial.program}</span>
      </span>
    </figcaption>
  </figure>
);

const Row: React.FC<{ items: Testimonial[]; reverse?: boolean; speed: string }> = ({ items, reverse, speed }) => (
  <div className="marquee-row edge-fade overflow-hidden motion-reduce:overflow-x-auto py-2">
    <div className="marquee-track items-stretch" data-reverse={reverse} style={{ '--marquee-speed': speed } as React.CSSProperties}>
      {items.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
      <div className="flex motion-reduce:hidden" aria-hidden="true">
        {items.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
      </div>
    </div>
  </div>
);

export const TestimonialsSection: React.FC = () => (
  <section id="testimonials-section" className="relative z-10 bg-bg py-24 md:py-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHead
        eyebrow="Practitioner Voices"
        title={['What Students', { em: 'Say' }]}
        sub="Real words from students across all programs."
        center
        className="mb-14"
      />
    </div>
    <FadeUp className="flex flex-col gap-3">
      <Row items={testimonials.slice(0, 3)} speed="70s" />
      <Row items={testimonials.slice(3)} speed="85s" reverse />
    </FadeUp>
  </section>
);
