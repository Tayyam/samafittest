import { Button } from '../../ui/Button';
import type { NutritionProperty } from '../../../types';

interface NutritionPropertyFormProps {
  formData: Omit<NutritionProperty, 'id' | 'createdAt' | 'updatedAt'>;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export const NutritionPropertyForm = ({
  formData,
  isEditing,
  onSubmit,
  onChange,
  onClose
}: NutritionPropertyFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">اسم العنصر</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">الكمية القياسية</label>
          <input
            type="number"
            name="standardServing"
            value={formData.standardServing}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">الوحدة</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">السعرات الحرارية</label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">البروتين (جرام)</label>
          <input
            type="number"
            name="protein"
            value={formData.protein}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">الكربوهيدرات (جرام)</label>
          <input
            type="number"
            name="carbs"
            value={formData.carbs}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">الدهون (جرام)</label>
          <input
            type="number"
            name="fats"
            value={formData.fats}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 space-x-reverse">
        <Button type="button" variant="secondary" onClick={onClose}>
          إلغاء
        </Button>
        <Button type="submit">
          {isEditing ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
}; 