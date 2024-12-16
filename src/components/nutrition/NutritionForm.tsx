import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { NutritionEntry } from '../../types';

interface NutritionFormProps {
  onSubmit: (data: Omit<NutritionEntry, 'id'>) => Promise<void>;
}

export const NutritionForm = ({ onSubmit }: NutritionFormProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      calories: Number(data.calories),
      protein: Number(data.protein),
      carbs: Number(data.carbs),
      fats: Number(data.fats),
      date: new Date(),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="الطعام"
          {...register('food', { required: 'هذا الحقل مطلوب' })}
          error={errors.food?.message}
        />
        <Input
          label="السعرات الحرارية"
          type="number"
          {...register('calories', { required: 'هذا الحقل مطلوب' })}
          error={errors.calories?.message}
        />
        <Input
          label="البروتين (جرام)"
          type="number"
          {...register('protein', { required: 'هذا الحقل مطلوب' })}
          error={errors.protein?.message}
        />
        <Input
          label="الكربوهيدرات (جرام)"
          type="number"
          {...register('carbs', { required: 'هذا الحقل مطلوب' })}
          error={errors.carbs?.message}
        />
        <Input
          label="الدهون (جرام)"
          type="number"
          {...register('fats', { required: 'هذا الحقل مطلوب' })}
          error={errors.fats?.message}
        />
      </div>
      <div className="mt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'جاري الإضافة...' : 'إضافة وجبة'}
        </Button>
      </div>
    </form>
  );
};