import { findNutritionProperty, addNutritionProperty } from '../firebase/nutritionProperties';
import { openai, isConfigured } from './config';
import type { NutritionAnalysis } from '../../types/nutrition';

const SYSTEM_PROMPT = `أنت خبير تغذية. مهمتك تحليل النص المدخل وتقسيمه إلى وجبات منفصلة.

المطلوب:
1. تقسيم النص إلى وجبات
2. تحديد مكونات كل وجبة وكمياتها بالضبط كما وردت في النص
3. تحليل القيم الغذائية لكل طعام بناءً على كميته المحددة

يجب إرجاع النتيجة بهذا التنسيق JSON فقط:
{
  "meals": [
    {
      "type": "breakfast|lunch|dinner|snack",
      "items": [
        {
          "food": "اسم الطعام",
          "amount": number,
          "unit": "جرام",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        }
      ]
    }
  ]
}

مثال للإدخال:
"موز ١٥٠ جرام
فول ١٥٠ جرام صافي"

مثال للإخراج:
{
  "meals": [
    {
      "type": "snack",
      "items": [
        {
          "food": "موز",
          "amount": 150,
          "unit": "جرام",
          "calories": 133,
          "protein": 1.6,
          "carbs": 34,
          "fats": 0.4
        },
        {
          "food": "فول",
          "amount": 150,
          "unit": "جرام",
          "calories": 180,
          "protein": 12,
          "carbs": 21,
          "fats": 2.4
        }
      ]
    }
  ]
}

قواعد مهمة:
- استخدم الكميات الفعلية من النص
- حول جميع الوحدات إلى جرام
- القيم الغذائية يجب أن تكون للكمية المحددة وليس لكل 100 جرام
- الأرقام يجب أن تكون بالإنجليزية

المعايير القياسية للتحويل:
- بيضة = 50 جرام
- كوب أرز مطبوخ = 150 جرام
- شريحة خبز = 30 جرام
- ملعقة زيت = 15 جرام
- حبة تمر = 15 جرام
- كوب حليب = 240 مل`;

export const analyzeNutrition = async (text: string): Promise<NutritionAnalysis[]> => {
  if (!isConfigured) {
    throw new Error('OpenAI API is not configured');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response:', content);
    const result = JSON.parse(content);
    
    if (!result.meals || !Array.isArray(result.meals)) {
      throw new Error('Invalid response format: missing meals array');
    }

    const analyses: NutritionAnalysis[] = [];
    
    for (const meal of result.meals) {
      if (!meal.items || !Array.isArray(meal.items)) {
        console.warn('Invalid meal format:', meal);
        continue;
      }

      for (const item of meal.items) {
        // التحقق من وجود جميع القيم المطلوبة
        if (!item.food || !item.amount || !item.calories || 
            !item.protein || !item.carbs || !item.fats) {
          console.warn('Invalid item data:', item);
          continue;
        }

        // التحقق من أن القيم رقمية
        const calories = Number(item.calories);
        const protein = Number(item.protein);
        const carbs = Number(item.carbs);
        const fats = Number(item.fats);

        if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
          console.warn('Invalid numeric values:', item);
          continue;
        }

        analyses.push({
          food: item.food,
          amount: Number(item.amount),
          unit: item.unit || 'جرام',
          calories: Math.max(0, Math.round(calories)),
          protein: Math.max(0, Math.round(protein)),
          carbs: Math.max(0, Math.round(carbs)),
          fats: Math.max(0, Math.round(fats))
        });
      }
    }

    if (analyses.length === 0) {
      throw new Error('No valid nutrition data found in response');
    }

    return analyses;
  } catch (error) {
    console.error('Error in nutrition analysis:', error);
    throw new Error('فشل في تحليل الطعام: ' + (error as Error).message);
  }
};