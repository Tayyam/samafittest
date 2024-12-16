import { findNutritionProperty, addNutritionProperty } from '../firebase/nutritionProperties';
import { openai, isConfigured } from './config';
import type { NutritionAnalysis } from '../../types/nutrition';

const SYSTEM_PROMPT = `أنت خبير تغذية. قم بتحليل الطعام المعطى باللغة العربية وتقديم محتواه الغذائي.
يجب أن تقوم بإرجاع بيانات JSON فقط بهذا التنسيق:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}
جميع الأرقام يجب أن تكون مقربة لأقرب رقم صحيح.
قم بتحليل الكمية المحددة من الطعام.`;

export const analyzeNutrition = async (food: string, amount: number = 100): Promise<NutritionAnalysis> => {
  console.log('Starting nutrition analysis for:', food, 'amount:', amount);

  if (!isConfigured) {
    throw new Error('OpenAI API is not configured');
  }

  try {
    // البحث أولاً في جدول خصائص التغذية
    const existingProperty = await findNutritionProperty(food);
    
    if (existingProperty) {
      console.log('Found existing nutrition property:', existingProperty);
      // حساب القيم بناءً على الكمية المدخلة
      const ratio = amount / existingProperty.standardServing;
      const result = {
        food,
        calories: Math.round(existingProperty.calories * ratio),
        protein: +(existingProperty.protein * ratio).toFixed(1),
        carbs: +(existingProperty.carbs * ratio).toFixed(1),
        fats: +(existingProperty.fats * ratio).toFixed(1)
      };
      console.log('Calculated nutrition values:', result);
      return result;
    }

    console.log('No existing property found, using OpenAI');
    // إذا لم يتم العثور على العنصر، استخدم ChatGPT
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: SYSTEM_PROMPT 
        },
        { 
          role: 'user', 
          content: `قم بتحليل ${amount} جرام من: ${food}` 
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      max_tokens: 150,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response:', content);
    const result = JSON.parse(content.trim());
    
    // التحقق من صحة البيانات
    if (!result.calories || !result.protein || !result.carbs || !result.fats) {
      throw new Error('Invalid nutrition data from OpenAI');
    }

    // حفظ النتيجة في جدول خصائص التغذية للاستخدام المستقبلي
    try {
      await addNutritionProperty({
        name: food,
        standardServing: 100,
        unit: 'جرام',
        calories: Math.round((result.calories / amount) * 100),
        protein: +((result.protein / amount) * 100).toFixed(1),
        carbs: +((result.carbs / amount) * 100).toFixed(1),
        fats: +((result.fats / amount) * 100).toFixed(1)
      });
      console.log('Saved new nutrition property');
    } catch (error) {
      console.error('Error saving nutrition property:', error);
    }

    const normalizedResult = {
      food,
      calories: Math.max(0, Math.round(result.calories)),
      protein: Math.max(0, +(result.protein).toFixed(1)),
      carbs: Math.max(0, +(result.carbs).toFixed(1)),
      fats: Math.max(0, +(result.fats).toFixed(1))
    };

    console.log('Final analysis result:', normalizedResult);
    return normalizedResult;

  } catch (error) {
    console.error('Error in analyzeNutrition:', error);
    throw new Error(`فشل في تحليل الطعام: ${error.message}`);
  }
};