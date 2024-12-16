import type { AnalyzedMeal } from '../../types';

const NUTRITION_PROMPT = `
أنت محلل تغذية محترف. قم بتحليل النص المدخل وتحديد:
1. هل هذا نص يحتوي على وجبة واحدة أم عدة وجبات
2. تحديد نوع كل وجبة (فطور، غداء، عشاء، سناك)
3. تحديد المكونات وكمياتها بدقة

قم بإرجاع النتيجة بتنسيق JSON كالتالي:
{
  "meals": [
    {
      "type": "breakfast|lunch|dinner|snack",
      "foods": [
        {
          "food": "اسم الطعام",
          "quantity": "الكمية بالأرقام",
          "unit": "الوحدة (جرام|حبة|كوب|ملعقة|قطعة|شريحة)"
        }
      ]
    }
  ]
}

مثال للإدخال: "فطور: بيضتين مسلوق وتوست"
مثال للإخراج:
{
  "meals": [
    {
      "type": "breakfast",
      "foods": [
        {
          "food": "بيض مسلوق",
          "quantity": "2",
          "unit": "حبة"
        },
        {
          "food": "توست",
          "quantity": "1",
          "unit": "شريحة"
        }
      ]
    }
  ]
}

ملاحظات مهمة:
- يجب أن تكون الكمية دائماً رقم
- الوحدات المسموحة: جرام، حبة، كوب، ملعقة، قطعة، شريحة
- إذا لم يتم تحديد الكمية، استخدم القيم الافتراضية المعتادة
`;

export const analyzeNutritionText = async (text: string): Promise<AnalyzedMeal[]> => {
  try {
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
            content: NUTRITION_PROMPT
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('فشل في الاتصال بخدمة التحليل');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return result.meals;

  } catch (error) {
    console.error('Error analyzing nutrition text:', error);
    throw error;
  }
}; 