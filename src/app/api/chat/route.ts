import { google } from '@ai-sdk/google';
import { convertToCoreMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, temperature: _temp, topK: _topK, topP: _topP } = await req.json();

  const temperature = Number(_temp as string);
  const topK = Number(_topK as string);
  const topP = Number(_topP as string);

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages: convertToCoreMessages(messages),
    temperature,
    topK,
    topP,
  });

  return result.toDataStreamResponse();
}
