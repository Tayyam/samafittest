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

const BATCH_ANALYSIS_PROMPT = `
أنت خبير تغذية متخصص في تحليل القيم الغذائية. مهمتك هي تقديم تحليل دقيق للماكروز والسعرات الحرارية.

قواعد مهمة للتحليل:
1. البيض المسلوق (حبة واحدة):
   - سعرات: 70-80
   - بروتين: 6-7g
   - دهون: 5-6g
   - كربوهيدرات: 0.5g

2. الأرز المطبوخ (100 جرام):
   - سعرات: 130-140
   - بروتين: 2.5-3g
   - كربوهيدرات: 28-30g
   - دهون: 0.3g

3. الحليب كامل الدسم (كوب 240مل):
   - سعرات: 150
   - بروتين: 8g
   - كربوهيدرات: 12g
   - دهون: 8g

4. الخبز الأبيض (شريحة):
   - سعرات: 80
   - بروتين: 2g
   - كربوهيدرات: 15g
   - دهون: 1g

قم بإرجاع النتيجة بتنسيق JSON:
{
  "results": [
    {
      "food": "اسم الطعام",
      "quantity": "الكمية",
      "unit": "الوحدة",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number
    }
  ]
}

ملاحظات هامة:
- اضرب القيم في الكمية المحددة
- تأكد من دقة النسب بين الماكروز والسعرات
- السعرات = (بروتين × 4) + (كربوهيدرات × 4) + (دهون × 9)
- قرّب الأرقام لأقرب عدد صحيح
- لا تقم بتقدير قيم غير منطقية
`;

export const useNutritionAnalysis = () => {
  const [loading, setLoading] = useState(false);

  const handleBatchAnalysis = async (items: NutritionAnalysisInput[]): Promise<NutritionAnalysisResult[]> => {
    try {
      setLoading(true);

      const foodList = items.map(item => ({
        food: item.food,
        quantity: item.quantity || '1',
        unit: item.unit || ''
      }));

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
              content: BATCH_ANALYSIS_PROMPT
            },
            {
              role: "user",
              content: JSON.stringify(foodList, null, 2)
            }
          ],
          temperature: 0.1 // تقليل العشوائية للحصول على نتائج أكثر ثباتاً
        })
      });

      if (!response.ok) {
        throw new Error('فشل في الاتصال بخدمة التحليل');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      if (!result.results || !Array.isArray(result.results)) {
        throw new Error('نتيجة التحليل غير صالحة');
      }

      // التحقق من صحة القيم
      return result.results.map((item: any) => {
        const calories = Math.round(item.calories);
        const protein = Math.round(item.protein);
        const carbs = Math.round(item.carbs);
        const fats = Math.round(item.fats);

        // التحقق من معادلة السعرات الحرارية
        const calculatedCalories = (protein * 4) + (carbs * 4) + (fats * 9);
        if (Math.abs(calculatedCalories - calories) > 50) {
          console.warn('تحذير: القيم الغذائية غير متوازنة', {
            food: item.food,
            calculated: calculatedCalories,
            provided: calories
          });
        }

        return {
          calories: Math.max(0, calories),
          protein: Math.max(0, protein),
          carbs: Math.max(0, carbs),
          fats: Math.max(0, fats)
        };
      });
    } catch (error) {
      console.error('Error in batch nutrition analysis:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleBatchAnalysis,
    loading
  };
};