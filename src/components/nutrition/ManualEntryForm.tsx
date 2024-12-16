import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { NutritionAnalysis } from '../../types/nutrition';

interface ManualEntryFormProps {
  initialFood?: string;
  onSubmit: (data: NutritionAnalysis & { food: string }) => void;
  onCancel: () => void;
}

export const ManualEntryForm = ({ initialFood = '', onSubmit, onCancel }: ManualEntryFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      food: initialFood,
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="اسم الطعام"
        {...register('food', { required: 'هذا الحقل مطلوب' })}
        error={errors.food?.message}
      />
      <Input
        label="السعرات الحرارية"
        type="number"
        {...register('calories', {
          required: 'هذا الحقل مطلوب',
          min: { value: 0, message: 'يجب أن تكون القيمة 0 أو أكثر' }
        })}
        error={errors.calories?.message}
      />
      <Input
        label="البروتين (جرام)"
        type="number"
        {...register('protein', {
          required: 'هذا الحقل مطلوب',
          min: { value: 0, message: 'يجب أن تكون القيمة 0 أو أكثر' }
        })}
        error={errors.protein?.message}
      />
      <Input
        label="الكربوهيدرات (جرام)"
        type="number"
        {...register('carbs', {
          required: 'هذا الحقل مطلوب',
          min: { value: 0, message: 'يجب أن تكون القيمة 0 أو أكثر' }
        })}
        error={errors.carbs?.message}
      />
      <Input
        label="الدهون (جرام)"
        type="number"
        {...register('fats', {
          required: 'هذا الحقل مطلوب',
          min: { value: 0, message: 'يجب أن تكون القيمة 0 أو أكثر' }
        })}
        error={errors.fats?.message}
      />
      <div className="flex justify-end space-x-2 space-x-reverse">
        <Button type="button" variant="secondary" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          إضافة
        </Button>
      </div>
    </form>
  );
};