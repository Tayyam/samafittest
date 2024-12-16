import { Configuration, OpenAIApi } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 200
    });

    const suggestions = completion.data.choices[0].message?.content
      ?.split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error calling ChatGPT:', error);
    res.status(500).json({ message: 'Error generating suggestions' });
  }
} 