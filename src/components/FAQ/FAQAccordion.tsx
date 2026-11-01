import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SectionHead, FadeUp } from '../ui/Reveal';
import { EASE_OUT } from '../../animations/shared/variants';

const faqs = [
  { q: 'What style of yoga does Binal teach?', a: 'Binal teaches a blend of Hatha, Ashtanga Vinyasa, and therapeutic yoga, grounded in classical yogic sutras and adapted for modern bodies. Every session emphasizes proper alignment, controlled breathing, and mindful progression.' },
  { q: 'Do I need prior yoga experience?', a: 'Not at all. Binal works with students from complete beginners to advanced practitioners. Every program is tailored to your current level and goals.' },
  { q: 'Are the online sessions live or recorded?', a: 'Online sessions are live and interactive via high-definition video. Binal provides real-time corrections and modifications just like in an in-person class.' },
  { q: 'Where are the in-person studio classes held?', a: 'In-person studio practice takes place in Gandhinagar, Gujarat. The studio is a dedicated yoga space equipped with mats, props, and a calm atmosphere.' },
  { q: 'How do I book a private session?', a: 'Send a message through the contact form on this site and mention the program you are interested in: private 1-on-1, group studio, or online streaming.' },
  { q: 'What is the cancellation policy?', a: 'You can cancel or reschedule up to 12 hours before the session at no charge. Late cancellations under 12 hours are subject to a 50% fee.' },
];

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 bg-bg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <SectionHead eyebrow="Questions" title={['Frequently', { em: 'Asked' }]} className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start" />

        <div className="lg:col-span-7">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeUp key={faq.q} delay={i * 0.05} y={18} className="border-t border-line last:border-b">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group w-full flex items-center justify-between gap-5 py-6 text-left cursor-pointer"
                >
                  <span className={`display !tracking-normal !leading-tight text-xl md:text-2xl transition-[color,translate] duration-500 group-hover:translate-x-1.5 ${isOpen ? 'text-terra' : 'text-ink'}`}>{faq.q}</span>
                  <span className={`relative w-10 h-10 rounded-full border shrink-0 transition-colors duration-500 ${isOpen ? 'bg-terra border-terra text-bg' : 'border-line text-ink'}`} aria-hidden="true">
                    <span className="absolute left-1/2 top-1/2 -ml-[7px] w-3.5 h-px bg-current" />
                    <motion.span
                      animate={{ rotate: isOpen ? 0 : 90 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                      className="absolute left-1/2 top-1/2 -ml-[7px] w-3.5 h-px bg-current"
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="text-base text-muted leading-relaxed pb-7 pr-14 max-w-2xl">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
};
