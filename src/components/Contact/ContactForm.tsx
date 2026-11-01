import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, Instagram, Loader2, Mail, MapPin } from 'lucide-react';
import { RevealText, FadeUp } from '../ui/Reveal';
import { Lotus } from '../ui/Lotus';
import { Magnetic } from '../ui/Magnetic';
import { EASE_OUT } from '../../animations/shared/variants';
import {
  CONTACT_ADDRESS, EMAILJS_CONTACT_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, isContactEmailConfigured,
} from '../../lib/email';

type Status = 'idle' | 'sending' | 'sent' | 'handoff' | 'error';

const PROGRAMS = [
  'Personal Training (1-on-1)',
  'Studio Group Classes',
  'Online Virtual Sessions',
  'Workshops & Events',
];

const fieldClass = 'peer w-full bg-transparent border-b border-line pt-6 pb-2.5 text-base text-ink focus:outline-none placeholder-transparent';
const labelClass = 'absolute left-0 top-6 text-base text-muted pointer-events-none origin-left transition-transform duration-300 peer-focus:-translate-y-5 peer-focus:scale-[0.82] peer-focus:text-terra peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-[0.82]';
const underline = 'absolute bottom-0 left-0 h-[2px] w-full bg-terra origin-left scale-x-0 peer-focus:scale-x-100 transition-transform duration-500';

const mailtoLink = (name: string, email: string, program: string, message: string) => {
  const subject = `Yoga enquiry from ${name}`;
  const body = `${message}\n\nInterested in: ${program || 'Not sure yet'}\nFrom: ${name} (${email})`;
  return `mailto:${CONTACT_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [fallbackHref, setFallbackHref] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name'));
    const email = String(data.get('email'));
    const program = String(data.get('program') ?? '');
    const message = String(data.get('message'));
    const href = mailtoLink(name, email, program, message);
    setFallbackHref(href);

    if (!isContactEmailConfigured()) {
      window.location.href = href;
      setStatus('handoff');
      return;
    }

    setStatus('sending');
    try {
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, { name, email, program, message }, { publicKey: EMAILJS_PUBLIC_KEY });
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative z-10 bg-bg py-24 md:py-32 overflow-hidden">
      <div className="absolute -right-[15vw] top-10 w-[50vw] h-[50vw] rounded-full bg-sun/20 blur-3xl animate-breathe pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-6">
          <FadeUp y={12}><span className="eyebrow text-terra">Get In Touch</span></FadeUp>
          <RevealText segments={['Start Your', { em: 'Practice' }]} className="display text-[clamp(3rem,8vw,7rem)] text-ink mt-4" />
          <FadeUp delay={0.25}>
            <p className="text-base md:text-lg text-muted leading-relaxed mt-6 max-w-md">
              Ready to begin? Send a message and Binal will respond within 24 hours during weekdays.
            </p>
            <div className="flex flex-col gap-4 mt-9 text-base text-ink">
              <a href={`mailto:${CONTACT_ADDRESS}`} className="flex items-center gap-3 no-underline w-fit hover:text-terra transition-colors break-all">
                <Mail className="w-5 h-5 text-sage shrink-0" /> {CONTACT_ADDRESS}
              </a>
              <a href="https://instagram.com/yoga_with_binal" target="_blank" rel="noreferrer" className="flex items-center gap-3 no-underline w-fit hover:text-terra transition-colors">
                <Instagram className="w-5 h-5 text-sage shrink-0" /> @yoga_with_binal
              </a>
              <span className="flex items-center gap-3"><MapPin className="w-5 h-5 text-sage shrink-0" /> Gandhinagar, Gujarat, India</span>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15} className="lg:col-span-6">
          <div className="relative min-h-[30rem] rounded-[2rem] bg-surface border border-line p-7 md:p-10 shadow-xl shadow-[var(--shadow)]">
            <AnimatePresence mode="wait">
              {status === 'sent' || status === 'handoff' ? (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                  className="min-h-[26rem] flex flex-col items-center justify-center text-center"
                  role="status"
                >
                  <Lotus draw className="w-28 text-terra" />
                  <h3 className="display text-4xl text-ink mt-6">{status === 'sent' ? 'Message sent' : 'Almost there'}</h3>
                  <p className="text-base text-muted leading-relaxed mt-3 max-w-sm">
                    {status === 'sent'
                      ? 'Thank you. Binal will reply within 24 hours during weekdays.'
                      : 'Your email app should have opened with the message ready. Press send there to reach Binal.'}
                  </p>
                  {status === 'handoff' && (
                    <a href={fallbackHref} className="mt-4 text-sm font-semibold text-terra">Open it again</a>
                  )}
                  <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-semibold text-ink underline underline-offset-4 cursor-pointer">Write another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0, y: -12 }} onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <input id="contact-name" name="name" type="text" placeholder="Name" autoComplete="name" required className={fieldClass} />
                      <label htmlFor="contact-name" className={labelClass}>Name</label>
                      <span className={underline} />
                    </div>
                    <div className="relative">
                      <input id="contact-email" name="email" type="email" placeholder="Email" autoComplete="email" required className={fieldClass} />
                      <label htmlFor="contact-email" className={labelClass}>Email</label>
                      <span className={underline} />
                    </div>
                  </div>

                  <div className="relative">
                    <select name="program" defaultValue="" aria-label="Program you are interested in" className="peer w-full appearance-none bg-transparent border-b border-line pt-6 pb-2.5 pr-8 text-base text-ink focus:outline-none cursor-pointer">
                      <option value="" disabled>Interested in...</option>
                      {PROGRAMS.map((p) => <option key={p} value={p} className="bg-surface text-ink">{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-0 bottom-3 w-4 h-4 text-muted pointer-events-none" />
                    <span className={underline} />
                  </div>

                  <div className="relative">
                    <textarea id="contact-message" name="message" rows={4} placeholder="Your message" required className={`${fieldClass} resize-none block`} />
                    <label htmlFor="contact-message" className={labelClass}>Your message</label>
                    <span className={underline} />
                  </div>

                  {status === 'error' && (
                    <p role="alert" className="text-sm text-terra">
                      That didn't go through. Please try again, or <a href={fallbackHref} className="font-semibold underline">send it by email</a>.
                    </p>
                  )}

                  <Magnetic strength={0.12} className="mt-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group w-full inline-flex items-center justify-between pl-7 pr-2 py-2 rounded-full bg-kit-terra text-cream text-base font-semibold cursor-pointer disabled:opacity-70"
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                      <span className="w-11 h-11 rounded-full bg-cream text-kit-terra flex items-center justify-center">
                        {status === 'sending'
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />}
                      </span>
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};
