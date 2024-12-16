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
          "unit": "الوحدة الأصلية (حبة|قطعة|كوب|ملعقة|جرام|...)",
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
"فطور:
- بيضتين مسلوق
- ٣ حبات تمر
- كوب حليب
غداء:
- صدر دجاج مشوي ٢٠٠ جرام
- ٢ كوب أرز"

مثال للإخراج:
{
  "meals": [
    {
      "type": "breakfast",
      "items": [
        {
          "food": "بيض مسلوق",
          "amount": 2,
          "unit": "حبة",
          "calories": 140,
          "protein": 12,
          "carbs": 0,
          "fats": 10
        },
        {
          "food": "تمر",
          "amount": 3,
          "unit": "حبة",
          "calories": 180,
          "protein": 1.5,
          "carbs": 45,
          "fats": 0.3
        },
        {
          "food": "حليب",
          "amount": 1,
          "unit": "كوب",
          "calories": 120,
          "protein": 8,
          "carbs": 12,
          "fats": 5
        }
      ]
    },
    {
      "type": "lunch",
      "items": [
        {
          "food": "صدر دجاج مشوي",
          "amount": 200,
          "unit": "جرام",
          "calories": 330,
          "protein": 62,
          "carbs": 0,
          "fats": 7.2
        },
        {
          "food": "أرز",
          "amount": 2,
          "unit": "كوب",
          "calories": 450,
          "protein": 8,
          "carbs": 98,
          "fats": 0.8
        }
      ]
    }
  ]
}

قواعد مهمة:
- احتفظ بالوحدات الأصلية كما وردت في النص
- احسب القيم الغذائية بناءً على الكمية والوحدة المحددة
- الأرقام يجب أن تكون بالإنجليزية
- القيم الغذائية يجب أن تكون للكمية المحددة وليس لكل 100 جرام`;

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
        if (!item.food || !item.amount) {
          console.warn('Missing required fields:', item);
          continue;
        }

        const nutritionData = {
          food: item.food,
          amount: Number(item.amount),
          unit: item.unit || 'جرام',
          calories: Math.round(Number(item.calories) || 0),
          protein: +Number(item.protein || 0).toFixed(1),
          carbs: +Number(item.carbs || 0).toFixed(1),
          fats: +Number(item.fats || 0).toFixed(1)
        };

        if (isNaN(nutritionData.amount) || 
            isNaN(nutritionData.calories) || 
            isNaN(nutritionData.protein) || 
            isNaN(nutritionData.carbs) || 
            isNaN(nutritionData.fats)) {
          console.warn('Invalid numeric values:', item);
          continue;
        }

        analyses.push(nutritionData);
      }
    }

    if (analyses.length === 0) {
      throw new Error('No valid nutrition data found in response');
    }

    console.log('Analyzed nutrition data:', analyses);
    return analyses;

  } catch (error) {
    console.error('Error in nutrition analysis:', error);
    throw new Error(`فشل في تحليل الطعام: ${error.message}`);
  }
};