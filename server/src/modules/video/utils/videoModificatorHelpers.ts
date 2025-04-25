import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import { processAIRequest } from '../../../services/aiRouter';
import { AIServiceType } from '../../../types/aiTypes';
import { analyzePausesPrompt } from '../../../prompts/aiPrompts';
import { AIResponseSchema, TranscriptSchema } from '../types/schemas';
import {
  PauseSegment,
  TranscriptSegment,
  WhisperVerboseResponse,
} from '../types/videoTypes';

/**
 * Extracts WAV audio from the video.
 */
export async function extractAudioFromVideo(
  videoPath: string,
  audioPath: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .save(audioPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

/**
 * Removes pauses from the video.
 */
export async function removePausesFromVideo(
  videoPath: string,
  pauses: PauseSegment[],
  outputPath: string,
): Promise<void> {
  const segments: PauseSegment[] = buildKeepSegments(pauses);

  const filters = segments
    .map((seg, i) => {
      const trimVideo = `[0:v]trim=start=${seg.start}:end=${seg.end},setpts=PTS-STARTPTS[v${i}]`;
      const trimAudio = `[0:a]atrim=start=${seg.start}:end=${seg.end},asetpts=PTS-STARTPTS[a${i}]`;
      return `${trimVideo};${trimAudio}`;
    })
    .join(';');

  const concatInputs = segments.map((_, i) => `[v${i}][a${i}]`).join('');
  const concatFilter = `${concatInputs}concat=n=${segments.length}:v=1:a=1[outv][outa]`;

  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .complexFilter(`${filters};${concatFilter}`, ['outv', 'outa'])
      .outputOptions('-map', '[outv]', '-map', '[outa]')
      .save(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

/**
 * The list of "remaining" segments without pauses.
 */
export function buildKeepSegments(pauses: PauseSegment[]): PauseSegment[] {
  const segments: PauseSegment[] = [];
  let lastEnd = 0;

  for (const { start, end } of pauses) {
    if (start > lastEnd) {
      segments.push({ start: lastEnd, end: start });
    }
    lastEnd = end;
  }

  return segments;
}

/**
 * Analyzes the transcript and returns pauses > 1.5 seconds through the AI service.
 */
export async function detectLongPauses(
  transcript: TranscriptSegment[],
  aiService: AIServiceType = 'openai',
): Promise<PauseSegment[]> {
  try {
    // Валидация входного транскрипта
    const parsedTranscript = TranscriptSchema.parse(transcript); // Проверяем, что транскрипт соответствует схеме

    // Получаем промт
    const result = await processAIRequest(aiService, 'text', {
      prompt: analyzePausesPrompt(parsedTranscript), // Передаем валидированные данные
    });

    // Валидация ответа от AI
    const parsedResponse = AIResponseSchema.parse(JSON.parse(result)); // Проверяем, что ответ соответствует схеме

    return parsedResponse; // Возвращаем валидированный результат
  } catch (err) {
    console.warn('Error while retrieving pauses from the AI service:', err);
    return [];
  }
}
/**
 * Deletes temporary files.
 */
export async function cleanupFiles(filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`Failed to delete the file: ${filePath}`, err);
    }
  }
}

export async function transcribeWithTimestamps(
  audioPath: string,
  service: AIServiceType = 'openai', // по умолчанию openai
): Promise<WhisperVerboseResponse> {
  const res = await processAIRequest(service, 'audio', { audioPath });

  if (!('segments' in res)) {
    throw new Error('❌ AI response does not contain "segments"');
  }

  return res as WhisperVerboseResponse;
}
