import { z } from 'zod';

export const TranscriptSegmentSchema = z.object({
  start: z.number().min(0),
  end: z.number().min(0),
  text: z.string().min(1),
});

// Схема для паузы
export const PauseSegmentSchema = z.object({
  start: z.number().min(0),
  end: z.number().min(0),
});

export const TranscriptSchema = z.array(TranscriptSegmentSchema);

export const AIResponseSchema = z.array(PauseSegmentSchema);
