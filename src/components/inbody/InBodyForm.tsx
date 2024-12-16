import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { InBodyData } from '../../types';

interface InBodyFormProps {
  onSubmit: (data: Omit<InBodyData, 'id'>) => Promise<void>;
}

export const InBodyForm = ({ onSubmit }: InBodyFormProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const handleFormSubmit = async (data: any) => {
    const score = calculateInBodyScore(data);
    await onSubmit({
      ...data,
      weight: Number(data.weight),
      muscleMass: Number(data.muscleMass),
      fatPercentage: Number(data.fatPercentage),
      score,
      date: new Date(),
    });
    reset();
  };

  const calculateInBodyScore = (data: any) => {
    // This is a simplified score calculation
    // In a real application, this would be more complex
    const weightFactor = 0.4;
    const muscleFactor = 0.4;
    const fatFactor = 0.2;
    
    const weightScore = Math.min(100, (data.weight / 100) * 100);
    const muscleScore = (data.muscleMass / 50) * 100;
    const fatScore = (1 - data.fatPercentage / 100) * 100;
    
    return Math.round(
      weightScore * weightFactor +
      muscleScore * muscleFactor +
      fatScore * fatFactor
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="الوزن (كجم)"
          type="number"
          step="0.1"
          {...register('weight', {
            required: 'هذا الحقل مطلوب',
            min: { value: 30, message: 'الوزن يجب أن يكون 30 كجم على الأقل' },
            max: { value: 200, message: 'الوزن يجب أن يكون أقل من 200 كجم' }
          })}
          error={errors.weight?.message}
        />
        <Input
          label="كتلة العضلات (كجم)"
          type="number"
          step="0.1"
          {...register('muscleMass', {
            required: 'هذا الحقل مطلوب',
            min: { value: 10, message: 'كتلة العضلات يجب أن تكون 10 كجم على الأقل' }
          })}
          error={errors.muscleMass?.message}
        />
        <Input
          label="نسبة الدهون (%)"
          type="number"
          step="0.1"
          {...register('fatPercentage', {
            required: 'هذا الحقل مطلوب',
            min: { value: 1, message: 'نسبة الدهون يجب أن تكون 1% على الأقل' },
            max: { value: 50, message: 'نسبة الدهون يجب أن تكون أقل من 50%' }
          })}
          error={errors.fatPercentage?.message}
        />
      </div>
      <div className="mt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'جاري الإضافة...' : 'إضافة قياس جديد'}
        </Button>
      </div>
    </form>
  );
};