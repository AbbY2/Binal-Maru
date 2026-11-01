import { motion } from 'motion/react';
import { ArrowUp, Instagram, Mail, MapPin } from 'lucide-react';
import { Lotus } from '../ui/Lotus';
import { Magnetic } from '../ui/Magnetic';
import { EASE_OUT } from '../../animations/shared/variants';
import { CONTACT_ADDRESS } from '../../lib/email';

const links = [
  { label: 'About', href: '#about-story-section' },
  { label: 'Journey', href: '#journey-timeline' },
  { label: 'Programs', href: '#programs' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const NAME = 'Binal Chavda';

export const Footer: React.FC = () => (
  <footer className="relative z-10 bg-umber text-cream overflow-hidden">
    <div className="absolute left-1/2 -bottom-[28vw] -ml-[35vw] w-[70vw] h-[70vw] rounded-full bg-sun/25 blur-[90px] pointer-events-none animate-breathe" />

    <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Lotus className="w-14 text-sun mb-5" />
          <p className="text-base text-cream/75 leading-relaxed max-w-sm">
            M.Y.A.Sc certified yoga instructor bridging classical yogic philosophy with modern wellness practice. Personal, studio, and online sessions worldwide.
          </p>
        </div>

        <div>
          <span className="eyebrow text-sun block mb-4">Quick Links</span>
          <div className="flex flex-col gap-2.5">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="group text-base text-cream/80 hover:text-cream no-underline w-fit">
                {link.label}
                <span className="block h-px bg-sun origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <span className="eyebrow text-sun block mb-4">Connect</span>
          <div className="flex flex-col gap-3 text-base text-cream/80">
            <a href="https://instagram.com/yoga_with_binal" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-cream no-underline">
              <Instagram className="w-4 h-4 text-sun shrink-0" /> @yoga_with_binal
            </a>
            <a href={`mailto:${CONTACT_ADDRESS}`} className="flex items-center gap-3 hover:text-cream no-underline break-all">
              <Mail className="w-4 h-4 text-sun shrink-0" /> {CONTACT_ADDRESS}
            </a>
            <span className="flex items-center gap-3"><MapPin className="w-4 h-4 text-sun shrink-0" /> Gandhinagar, India</span>
          </div>
        </div>
      </div>

      <div className="display text-[clamp(3rem,14vw,13.5rem)] whitespace-nowrap text-center mt-16 !leading-none" aria-hidden="true">
        {NAME.split('').map((char, i) => (
          <span key={i} className="word-mask">
            <motion.span
              initial={{ y: '110%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: i * 0.035 }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-cream/15 text-sm text-cream/70">
        <span>&copy; {new Date().getFullYear()} Binal Chavda. All rights reserved.</span>
        <Magnetic>
          <a href="#" className="flex items-center gap-2 text-cream/80 hover:text-cream no-underline py-2 px-1 group">
            <ArrowUp className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-1" />
            Back to top
          </a>
        </Magnetic>
      </div>
    </div>
  </footer>
);
