import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Hiányzik a RESEND_API_KEY a környezeti változókból!');
}

export const resend = new Resend(process.env.RESEND_API_KEY);