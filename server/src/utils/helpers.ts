import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
}

type WhisperVerboseResponse = {
    segments: TranscriptSegment[];
};


export async function transcribeWithTimestamps(audioPath: string): Promise<TranscriptSegment[] | any> {
    const transcription = await openai.audio.transcriptions.create(
        {
            file: fs.createReadStream(audioPath),
            model: 'whisper-1',
            response_format: 'verbose_json',
            timestamp_granularity: 'word',
        } as any
    );

    const verbose = transcription as WhisperVerboseResponse;
    return verbose.segments;
}
