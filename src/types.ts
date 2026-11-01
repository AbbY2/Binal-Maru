/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface YogaInstructor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  longBio: string;
  image: string;
  certifications: string[];
  styles: string[];
  soundTheme: string; // e.g. 'cosmos', 'ocean', 'forest'
  experienceYears: number;
}

export interface ClassSession {
  id: string;
  instructorId: string;
  title: string;
  type: string; // 'Vinyasa', 'Ashtanga', 'Yin', 'Breathwork'
  duration: number; // in minutes
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  day: string; // 'Monday', 'Wednesday', etc.
  spotsLeft: number;
  price: number;
}

export interface SoundscapePreset {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  droneFreq: number; // Hz for base drone
  chordFreqs: number[]; // Hz for harmonic overlay chords
  noiseType: 'ocean' | 'forest' | 'rain' | 'none';
}

export interface Booking {
  id: string;
  instructorId: string;
  sessionId: string;
  clientName: string;
  clientEmail: string;
  date: string;
}
