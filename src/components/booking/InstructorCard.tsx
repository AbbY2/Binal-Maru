/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { YogaInstructor } from '../../types';
import { Sparkles, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { globalSoundscape } from '../sound/SoundscapeEngine';

interface InstructorCardProps {
  instructor: YogaInstructor;
  onClick: () => void;
  isDarkMode: boolean;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onClick, isDarkMode }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, showGlow: false });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse coordinates tracking for 3D tilting effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Position of cursor relative to card center
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates from -0.5 to 0.5
    const xNorm = mouseX / width;
    const yNorm = mouseY / height;

    setCoords({
      x: xNorm,
      y: yNorm,
      showGlow: true
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCoords(prev => ({ ...prev, showGlow: true }));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0, showGlow: false });
  };

  // Click triggers soft audio response and tactile haptics
  const handleCardClick = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15); // soft touch haptic
      }
    } catch (e) {
      // Ignore vibration security exceptions in sandboxed iframes
    }
    
    // Trigger instructor theme tone (different note based on ID)
    const baseFreq = instructor.name.includes('Aria') ? 330 : instructor.name.includes('Marcus') ? 220 : 275;
    globalSoundscape.triggerSingingBowl(baseFreq, 0.85);
    
    onClick();
  };

  // Maximum tilt limit
  const maxTilt = 12; // degrees
  const rotateY = coords.x * maxTilt;
  const rotateX = -coords.y * maxTilt; // inverted

  // Glow position mapped directly to cursor position
  const glowX = (coords.x + 0.5) * 100;
  const glowY = (coords.y + 0.5) * 100;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="relative group w-full aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer select-none transition-all duration-300 shadow-lg hover:shadow-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800/50"
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.025 : 1})`,
        transition: isHovered ? 'none' : 'all 0.5s ease'
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      {/* 1. Backdrop Image with smooth blur-on-hover zoom */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ transform: 'translateZ(-10px)' }} // pushes depth backwards
      >
        <img
          src={instructor.image}
          alt={instructor.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-[0.85] contrast-[1.05]"
        />
        {/* Calming Vignette Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/30 to-stone-950/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
      </div>

      {/* 2. Sleek Interactive Shimmer Glow Flare (Tracks Cursor) */}
      {coords.showGlow && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.18), transparent 80%)`
          }}
        />
      )}

      {/* 3. Floating Card Elements with Perspective Lift (translateZ) */}
      <div 
        className="absolute top-5 left-5 right-5 flex justify-between items-center z-20 pointer-events-none"
        style={{ transform: 'translateZ(30px)' }}
      >
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase text-stone-200 bg-stone-950/40 backdrop-blur-md border border-stone-200/10">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          {instructor.specialty}
        </span>
        <button 
          className="p-2 rounded-full text-stone-200 bg-stone-950/40 backdrop-blur-md border border-stone-200/10 hover:bg-stone-200 hover:text-stone-950 transition-colors duration-300 pointer-events-auto"
          aria-label="Save Favorite"
          onClick={(e) => {
            e.stopPropagation();
            try {
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([10, 30, 10]);
              }
            } catch (err) {
              // Ignore vibration security exceptions in sandboxed iframes
            }
            globalSoundscape.triggerSingingBowl(440, 0.5);
          }}
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Bottom Text Card Block with Perspective Lift */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-6 z-20 text-stone-100 flex flex-col gap-2.5 pointer-events-none"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">
            {instructor.experienceYears} Years Certified
          </span>
          <h3 className="font-serif text-2xl tracking-wide group-hover:text-emerald-300 transition-colors duration-300">
            {instructor.name}
          </h3>
        </div>

        <p className="text-xs text-stone-300/90 leading-relaxed font-sans line-clamp-2">
          {instructor.bio}
        </p>

        {/* Style Badges Row */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {instructor.styles.slice(0, 3).map((style, idx) => (
            <span 
              key={idx} 
              className="text-[9px] font-mono tracking-wider uppercase text-stone-300 bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded border border-white/5"
            >
              {style}
            </span>
          ))}
        </div>

        {/* Simulated immersive action cue */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-stone-100/10 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
            Explore Portfolio & Booking
          </span>
          <Calendar className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* 5. Elegant subtle outer border highlight */}
      <div className="absolute inset-0 border-2 border-emerald-500/0 group-hover:border-emerald-500/10 rounded-3xl transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};
