import { openai, isConfigured } from './config';
import type { NutritionAnalysis } from '../../types/nutrition';

const SYSTEM_PROMPT = `You are a nutrition expert. Analyze the given food items in Arabic and provide their nutritional content.
Return only JSON data in this format:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}
All numbers should be rounded to the nearest whole number.
Base your analysis on typical portion sizes.`;

export const analyzeNutrition = async (food: string): Promise<NutritionAnalysis> => {
  if (!isConfigured) {
    throw new Error('OpenAI API is not configured');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `تحليل: ${food}` }
      ],
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 150,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Validate and normalize the response
    return {
      calories: Math.max(0, Math.round(result.calories)),
      protein: Math.max(0, Math.round(result.protein)),
      carbs: Math.max(0, Math.round(result.carbs)),
      fats: Math.max(0, Math.round(result.fats))
    };
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    throw error;
  }
};