import dotenv from 'dotenv';
dotenv.config();

export const API_KEYS = {
  openai: process.env.OPENAI_API_KEY!,
  gmini: process.env.GMINI_API_KEY!,
};
