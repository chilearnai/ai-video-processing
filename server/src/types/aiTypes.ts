export type AIServiceType = 'openai' | 'gmini';

export interface TextRequest {
  prompt: string;
}

export interface AudioRequest {
  audioPath: string;
}
