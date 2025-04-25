import OpenAI from 'openai';

type ChatCompletionMessageParam = OpenAI.Chat.ChatCompletionMessageParam;

export const analyzePausesPrompt = (
  transcript: any,
): ChatCompletionMessageParam[] => [
  {
    role: 'user',
    content: `
      Analyze the speech transcript with timestamps. Find all pauses longer than 1.5 seconds between speech segments.
      Return the result as an array of objects with "start" and "end" fields.
      [
        { "start": 12.5, "end": 14.3 },
        ...
      ]
      
      Here is the transcript:
      ${JSON.stringify(transcript)}
    `,
  },
];
