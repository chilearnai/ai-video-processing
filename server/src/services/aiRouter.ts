import { handleOpenAIText, handleOpenAIAudio } from './openaiService';
import { handleGminiText, handleGminiAudio } from './gminiService';
import { AIServiceType } from '../types/aiTypes';

export const processAIRequest = async (
  service: AIServiceType,
  action: 'text' | 'audio',
  data: any,
): Promise<any> => {
  switch (service) {
    case 'openai':
      return action === 'text'
        ? handleOpenAIText(data.prompt)
        : handleOpenAIAudio(data.audioPath);
    case 'gmini':
      return action === 'text'
        ? handleGminiText(data.prompt)
        : handleGminiAudio(data.audioPath);
    default:
      throw new Error(`Unsupported AI service: ${service}`);
  }
};
