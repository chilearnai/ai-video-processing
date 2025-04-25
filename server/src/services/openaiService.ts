import fs from 'fs';
import { OpenAI } from 'openai';
import { API_KEYS } from '../config/apiKeys';

const openai = new OpenAI({ apiKey: API_KEYS.openai });

export const handleOpenAIText = async (prompt: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content || '';
};

export const handleOpenAIAudio = async (audioPath: string): Promise<any> => {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: 'whisper-1',
    response_format: 'verbose_json',
  });
  return response;
};
