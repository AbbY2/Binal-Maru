/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import { ClassSession, YogaInstructor } from '../../types';
import { Calendar, Clock, User, ArrowRight, ShieldCheck, CheckCircle2, Ticket, Sparkles, X, AlertTriangle, Loader2 } from 'lucide-react';
import { globalSoundscape } from '../sound/SoundscapeEngine';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, isEmailConfigured } from '../../lib/email';

interface BookingCalendarProps {
  instructors: YogaInstructor[];
  isDarkMode: boolean;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ instructors, isDarkMode }) => {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [bookingSession, setBookingSession] = useState<ClassSession | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSendFailed, setEmailSendFailed] = useState(false);

  // Raw Schedule Sessions Linked to Binal's Signature Offerings
  const [sessions, setSessions] = useState<ClassSession[]>([
    { id: 's1', instructorId: 'ins_online', title: 'Rise & Radiant Virtual Vinyasa', type: 'Vinyasa', duration: 60, level: 'All Levels', time: '08:00 AM', day: 'Monday', spotsLeft: 12, price: 15 },
    { id: 's2', instructorId: 'ins_offline', title: 'Gandhinagar Studio Morning Ashtanga', type: 'Ashtanga', duration: 75, level: 'Intermediate', time: '07:15 AM', day: 'Tuesday', spotsLeft: 5, price: 20 },
    { id: 's3', instructorId: 'ins_online', title: 'Evening Prana & Coherence Glow', type: 'Breathwork', duration: 45, level: 'All Levels', time: '06:00 PM', day: 'Wednesday', spotsLeft: 15, price: 12 },
    { id: 's4', instructorId: 'ins_personal', title: '1-on-1 Personalized Posture Alignment', type: 'Vinyasa', duration: 60, level: 'All Levels', time: '10:00 AM', day: 'Thursday', spotsLeft: 1, price: 50 },
    { id: 's5', instructorId: 'ins_personal', title: '1-on-1 Somatic Rehabilitation & Yin Therapy', type: 'Yin', duration: 90, level: 'All Levels', time: '04:30 PM', day: 'Friday', spotsLeft: 1, price: 60 },
    { id: 's6', instructorId: 'ins_offline', title: 'Gandhinagar Classical Hatha Masterclass', type: 'Ashtanga', duration: 90, level: 'Advanced', time: '08:00 AM', day: 'Sunday', spotsLeft: 8, price: 25 }
  ]);

  const daysList = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'];
  const stylesList = ['All', 'Vinyasa', 'Ashtanga', 'Yin', 'Breathwork'];

  const triggerHaptic = (pattern: number | number[]) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Ignore vibration security exceptions in sandboxed iframes
    }
  };

  const handleDaySelect = (day: string) => {
    triggerHaptic(8);
    setSelectedDay(day);
  };

  const handleStyleSelect = (style: string) => {
    triggerHaptic(8);
    setSelectedStyle(style);
  };

  const startBookingFlow = (session: ClassSession) => {
    triggerHaptic(12);
    setBookingSession(session);
    setIsSuccess(false);
    
    // Play a gentle welcoming note for booking
    globalSoundscape.triggerSingingBowl(330, 0.7);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !bookingSession) return;

    const instructor = getInstructor(bookingSession.instructorId);
    setIsSending(true);
    setEmailSendFailed(false);

    // Attempt to send a real booking-confirmation email via EmailJS.
    // If it isn't configured yet (see src/lib/email.ts), skip the network
    // call but keep the booking flow working so the demo/UI never breaks.
    if (isEmailConfigured()) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            client_name: formData.name,
            client_email: formData.email,
            session_title: bookingSession.title,
            session_day: bookingSession.day,
            session_time: bookingSession.time,
            session_duration: `${bookingSession.duration} mins`,
            instructor_name: instructor?.name || 'Binal Chavda',
            price: `$${bookingSession.price}`,
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        );
      } catch (err) {
        console.error('Booking email failed to send:', err);
        setEmailSendFailed(true);
      }
    } else {
      console.warn(
        'EmailJS is not configured yet — booking confirmations are not being emailed. See src/lib/email.ts for setup instructions.'
      );
      setEmailSendFailed(true);
    }

    // Deduct spot count locally to show responsive updates
    setSessions(prev => prev.map(s => {
      if (s.id === bookingSession.id) {
        return { ...s, spotsLeft: Math.max(0, s.spotsLeft - 1) };
      }
      return s;
    }));

    // Immersive auditory success cues: higher pitch harmonic chime
    globalSoundscape.triggerSingingBowl(440, 1.0);
    setTimeout(() => globalSoundscape.triggerSingingBowl(660, 0.8), 120);
    setTimeout(() => globalSoundscape.triggerSingingBowl(880, 0.6), 240);

    // Dynamic haptic rhythmic pattern
    triggerHaptic([30, 80, 40, 150]);

    setIsSending(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '' });
  };

  // Find instructor details for a class
  const getInstructor = (id: string) => instructors.find(ins => ins.id === id);

  // Filtering Logic
  const filteredSessions = sessions.filter(session => {
    const matchesDay = selectedDay === 'All' || session.day === selectedDay;
    const matchesStyle = selectedStyle === 'All' || session.type === selectedStyle;
    return matchesDay && matchesStyle;
  });

  return (
    <div id="booking-calendar-module" className="w-full">
      
      {/* 1. Day & Style Interactive Filter Controls */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Day Filter */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-emerald-500" />
            Filter by Calendar Day
          </span>
          <div className="flex flex-wrap gap-2">
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelect(day)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-300 ${
                  selectedDay === day
                    ? 'bg-emerald-600 text-stone-50 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Yoga Style Filter */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Filter by Yoga Style
          </span>
          <div className="flex flex-wrap gap-2">
            {stylesList.map((style) => (
              <button
                key={style}
                onClick={() => handleStyleSelect(style)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-300 ${
                  selectedStyle === style
                    ? 'bg-stone-800 dark:bg-stone-100 text-stone-50 dark:text-stone-950 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Available Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session, index) => {
              const instructor = getInstructor(session.instructorId);
              const isLastSpot = session.spotsLeft === 1;

              return (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/40 dark:border-stone-800/40 hover:border-emerald-500/30 hover:bg-stone-100/30 dark:hover:bg-stone-800/10 transition-all duration-300 flex flex-col justify-between gap-5 shadow-sm group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/5 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                          {session.day}
                        </span>
                        <span className="font-mono text-[9px] tracking-widest text-stone-500 dark:text-stone-400 uppercase">
                          {session.level}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-serif text-lg tracking-wide text-stone-800 dark:text-stone-100 mt-2.5">
                        {session.title}
                      </h3>
                      
                      {/* Instructor Tag */}
                      {instructor && (
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-2 font-sans">
                          <User className="w-3.5 h-3.5 text-emerald-600/70" />
                          <span>Led by <strong className="font-medium text-stone-700 dark:text-stone-300">{instructor.name}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="text-right">
                      <span className="font-serif text-xl font-medium text-stone-900 dark:text-stone-100">${session.price}</span>
                      <span className="block font-mono text-[9px] text-stone-400 dark:text-stone-500 uppercase">Per Session</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-200/30 dark:border-stone-800/30 pt-3.5">
                    {/* Time & Duration */}
                    <div className="flex items-center gap-4 text-xs font-mono text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {session.time}
                      </span>
                      <span>•</span>
                      <span>{session.duration} mins</span>
                    </div>

                    {/* Spots Counter & Action Button */}
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${
                        session.spotsLeft === 0 
                          ? 'text-stone-400' 
                          : isLastSpot 
                            ? 'text-rose-500 font-semibold animate-pulse' 
                            : 'text-stone-500 dark:text-stone-400'
                      }`}>
                        {session.spotsLeft === 0 
                          ? 'Fully Booked' 
                          : `${session.spotsLeft} Spots Left`}
                      </span>

                      <button
                        onClick={() => startBookingFlow(session)}
                        disabled={session.spotsLeft === 0}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase bg-stone-900 hover:bg-emerald-600 dark:bg-stone-100 dark:hover:bg-emerald-600 text-stone-100 dark:text-stone-900 hover:text-stone-50 transition-all duration-300 active:scale-95 disabled:bg-stone-200 dark:disabled:bg-stone-800 disabled:text-stone-400 disabled:pointer-events-none group-hover:shadow-sm"
                      >
                        Reserve
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-2 py-12 text-center rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
              <span className="font-mono text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                No matching sessions found. Try expanding filters.
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Immersive Interactive Booking Overlay Sheet (Popup Modal) */}
      <AnimatePresence>
        {bookingSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop with high blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                triggerHaptic(5);
                setBookingSession(null);
              }}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl z-10 text-stone-900 dark:text-stone-100"
            >
              <button
                onClick={() => {
                  triggerHaptic(5);
                  setBookingSession(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>

              {!isSuccess ? (
                // Reservation Form
                <form onSubmit={handleConfirmBooking} className="flex flex-col gap-6">
                  <div>
                    <span className="font-mono text-[10px] text-emerald-500 tracking-widest uppercase">
                      Confirming Spot
                    </span>
                    <h3 className="font-serif text-2xl tracking-wide text-stone-800 dark:text-stone-100 mt-1">
                      Reserve Private Sanctuary
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                      Enter your details below to finalize booking. Your spot is locked for 5 minutes.
                    </p>
                  </div>

                  {/* Booking Summary Card */}
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-950 border border-stone-200/40 dark:border-stone-800/30 flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 text-xs">
                      <span className="font-serif text-sm font-semibold text-stone-800 dark:text-stone-100">
                        {bookingSession.title}
                      </span>
                      <span className="text-stone-400 font-mono">
                        {bookingSession.day} at {bookingSession.time} • {bookingSession.duration}m
                      </span>
                      <span className="text-stone-500 dark:text-stone-400">
                        Led by <strong className="text-stone-700 dark:text-stone-300">{getInstructor(bookingSession.instructorId)?.name}</strong>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ${bookingSession.price}
                      </span>
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="client-name" className="text-[10px] font-mono tracking-widest uppercase text-stone-400">
                        Your Full Name
                      </label>
                      <input
                        id="client-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Maya Lin"
                        className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="client-email" className="text-[10px] font-mono tracking-widest uppercase text-stone-400">
                        Email Address
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. maya@breathe.com"
                        className="px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/30 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-3.5 rounded-xl font-mono text-xs tracking-wider uppercase text-stone-50 bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Confirmation...
                        </>
                      ) : (
                        <>
                          Confirm Booking for ${bookingSession.price}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-stone-400 tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      SECURE OFFLINE PROCESSING
                    </div>
                  </div>
                </form>
              ) : (
                // Success State with organic, relaxing feedback
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: [0.5, 1.1, 1.0] }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-5"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>

                  <span className="font-mono text-[10px] text-emerald-500 tracking-widest uppercase">
                    Namaste, {formData.name || 'Yogi'}
                  </span>

                  <h3 className="font-serif text-3xl tracking-wide text-stone-800 dark:text-stone-100 mt-2">
                    Sanctuary Reserved
                  </h3>

                  {emailSendFailed ? (
                    <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mt-3 leading-relaxed">
                      Your spot is locked in. The automated email to <strong className="text-stone-700 dark:text-stone-300 font-medium">{formData.email}</strong> couldn't be sent right now — Binal will confirm your session directly.
                    </p>
                  ) : (
                    <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mt-3 leading-relaxed">
                      A confirmation ticket and ambient pre-session guide have been routed to <strong className="text-stone-700 dark:text-stone-300 font-medium">{formData.email}</strong>.
                    </p>
                  )}

                  <div className="w-full h-px bg-stone-200 dark:bg-stone-800/60 my-6" />

                  {/* Rhythmic breathing prompt for success calming */}
                  <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-950/40 border border-emerald-500/10 flex flex-col gap-1.5 max-w-sm">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Post-Booking Breath
                    </span>
                    <p className="text-xs text-stone-400 leading-relaxed font-sans">
                      Take 1 slow breath now. Let the ambient synthesizer guide your exhalation into deep calm.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      triggerHaptic(8);
                      setBookingSession(null);
                    }}
                    className="mt-8 px-6 py-2.5 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-mono tracking-widest uppercase text-stone-600 dark:text-stone-300 transition-colors"
                  >
                    Return to Timeline
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
