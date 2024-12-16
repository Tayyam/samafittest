import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import type { NutritionProperty } from '../../types';

interface AddNutritionPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<NutritionProperty, 'id'>) => Promise<void>;
}

export const AddNutritionPropertyDialog = ({
  isOpen,
  onClose,
  onAdd
}: AddNutritionPropertyDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    standardServing: 100,
    unit: 'جرام',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="إضافة عنصر غذائي جديد">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            اسم العنصر
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الكمية القياسية
            </label>
            <input
              type="number"
              required
              value={formData.standardServing}
              onChange={(e) => setFormData({ ...formData, standardServing: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الوحدة
            </label>
            <input
              type="text"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              السعرات
            </label>
            <input
              type="number"
              required
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              البروتين (جرام)
            </label>
            <input
              type="number"
              required
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الكربوهيدرات (جرام)
            </label>
            <input
              type="number"
              required
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              الدهون (جرام)
            </label>
            <input
              type="number"
              required
              value={formData.fats}
              onChange={(e) => setFormData({ ...formData, fats: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 space-x-reverse">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-sama-dark rounded-md hover:bg-sama-light"
          >
            إضافة
          </button>
        </div>
      </form>
    </Dialog>
  );
}; 