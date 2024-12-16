import { useState } from 'react';
import type { NutritionAnalysis } from '../../types';

interface NutritionInputProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const NutritionInput = ({ onSubmit, isLoading }: NutritionInputProps) => {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || isLoading) return;

    try {
      setAnalyzing(true);
      await onSubmit(text);
      setText(''); // مسح النص بعد الإضافة بنجاح
    } catch (error) {
      console.error('Error submitting text:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="اكتب ما تناولته... (مثال: تناولت فطور اليوم بيضتين مسلوق مع توست وكوب حليب)"
        className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-sama-light focus:border-sama-light"
        disabled={analyzing || isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={analyzing || isLoading || !text.trim()}
        className="absolute bottom-4 left-4 bg-sama-light text-white px-4 py-2 rounded-md hover:bg-sama-dark disabled:opacity-50"
      >
        {analyzing ? 'جاري التحليل...' : 'إضافة'}
      </button>
    </div>
  );
};