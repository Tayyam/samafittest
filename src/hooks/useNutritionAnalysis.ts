import { useState } from 'react';

interface NutritionAnalysisInput {
  food: string;
  quantity?: string;
  unit?: string;
}

interface NutritionAnalysisResult {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const NUTRITION_ANALYSIS_PROMPT = `
أنت محلل تغذية محترف. قم بتحليل الطعام المدخل وكميته وإرجاع القيم الغذائية بناءً على الكمية المحددة.

قم بإرجاع النتيجة بتنسيق JSON فقط، بهذا الشكل:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}

أمثلة:
- "2 بيض مسلوق" يجب أن يرجع تحليل لبيضتين
- "200 جرام أرز" يجب أن يرجع تحليل ل 200 جرام
- "كوب حليب" يجب أن يرجع تحليل لكوب واحد (240 مل)

ملاحظات:
- جميع القيم يجب أن تكون أرقام موجبة
- قم بتقريب الأرقام لأقرب عدد صحيح
- احسب القيم بناءً على الكمية المحددة
`;

export const useNutritionAnalysis = () => {
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async (input: NutritionAnalysisInput): Promise<NutritionAnalysisResult> => {
    try {
      setLoading(true);

      const analysisText = `${input.quantity || '1'} ${input.unit || ''} ${input.food}`.trim();

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: NUTRITION_ANALYSIS_PROMPT
            },
            {
              role: "user",
              content: analysisText
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error('فشل في الاتصال بخدمة التحليل');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      // التحقق من صحة النتيجة
      if (!result || 
          typeof result.calories !== 'number' || 
          typeof result.protein !== 'number' || 
          typeof result.carbs !== 'number' || 
          typeof result.fats !== 'number' ||
          result.calories < 0 ||
          result.protein < 0 ||
          result.carbs < 0 ||
          result.fats < 0) {
        throw new Error('نتيجة التحليل غير صالحة');
      }

      return {
        calories: Math.round(result.calories),
        protein: Math.round(result.protein),
        carbs: Math.round(result.carbs),
        fats: Math.round(result.fats)
      };
    } catch (error) {
      console.error('Error in nutrition analysis:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAnalysis,
    loading
  };
};