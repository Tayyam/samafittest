import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { WorkoutEntry } from '../../types';

interface WorkoutFormProps {
  onSubmit: (data: Omit<WorkoutEntry, 'id'>) => Promise<void>;
}

export const WorkoutForm = ({ onSubmit }: WorkoutFormProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      caloriesBurned: Number(data.caloriesBurned),
      duration: Number(data.duration),
      date: new Date(),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="التمرين"
          {...register('exercise', { required: 'هذا الحقل مطلوب' })}
          error={errors.exercise?.message}
        />
        <Input
          label="المدة (دقيقة)"
          type="number"
          {...register('duration', { 
            required: 'هذا الحقل مطلوب',
            min: { value: 1, message: 'يجب أن تكون المدة دقيقة واحدة على الأقل' }
          })}
          error={errors.duration?.message}
        />
        <Input
          label="السعرات المحروقة"
          type="number"
          {...register('caloriesBurned', { 
            required: 'هذا الحقل مطلوب',
            min: { value: 0, message: 'يجب أن تكون السعرات المحروقة 0 على الأقل' }
          })}
          error={errors.caloriesBurned?.message}
        />
      </div>
      <div className="mt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'جاري الإضافة...' : 'إضافة تمرين'}
        </Button>
      </div>
    </form>
  );
};