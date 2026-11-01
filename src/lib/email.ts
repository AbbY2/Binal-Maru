/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EmailJS configuration for real booking-confirmation emails.
 *
 * This app has no server, so booking notifications are sent client-side via
 * EmailJS (https://www.emailjs.com) — a free tier covers ~200 emails/month,
 * which is plenty for a solo yoga teacher's booking volume.
 *
 * Setup (one-time, ~5 minutes):
 *   1. Create a free account at https://www.emailjs.com
 *   2. Add an Email Service (Gmail/Outlook/etc.) — note the "Service ID"
 *   3. Create an Email Template with variables: {{client_name}}, {{client_email}},
 *      {{session_title}}, {{session_day}}, {{session_time}}, {{instructor_name}},
 *      {{price}} — note the "Template ID"
 *   4. Copy your account's "Public Key" from Account > General
 *   5. Fill these into a local .env.local file (see .env.example)
 *
 * Until configured, bookings still work in the UI (demo mode) but no real
 * email is sent — a console warning will note this during development.
 */
export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const isEmailConfigured = (): boolean =>
  Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

/** Optional second template for the contact form: {{name}}, {{email}}, {{program}}, {{message}}. */
export const EMAILJS_CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || '';

export const isContactEmailConfigured = (): boolean =>
  Boolean(EMAILJS_SERVICE_ID && EMAILJS_CONTACT_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

export const CONTACT_ADDRESS = 'binal@yogawithbinal.com';
