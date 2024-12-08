// chatgptService.ts
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export interface ChatGPTRequest {
  role?: string;
  instructions: string;
  additionalContext?: string;
  model?: string;
}

export const chatGPTRequest = async ({
  role,
  instructions,
  additionalContext,
  model = 'gpt-3.5-turbo',
}: ChatGPTRequest): Promise<string> => {
  const messages = [
    {
      role: 'system',
      content: role || 'You are an assistant that provides useful responses.',
    },
    {
      role: 'user',
      content: instructions,
    },
  ];

  if (additionalContext) {
    messages.push({
      role: 'user',
      content: additionalContext,
    });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    throw new Error('Failed to fetch response from ChatGPT');
  }
};
