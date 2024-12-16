import { useState } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useNutritionProperties } from '../../hooks/useNutritionProperties';
import { Dialog } from '../../components/ui/Dialog';
import { Pencil, Trash2 } from 'lucide-react';
import type { NutritionProperty } from '../../types';

export const NutritionPropertiesPage = () => {
  const { properties, loading, addProperty, updateProperty, deleteProperty } = useNutritionProperties();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<NutritionProperty | null>(null);
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
    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, formData);
        setEditingProperty(null);
      } else {
        await addProperty(formData);
        setIsAddDialogOpen(false);
      }
      setFormData({
        name: '',
        standardServing: 100,
        unit: 'جرام',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      });
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const PropertyDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={editingProperty ? 'تعديل عنصر غذائي' : 'إضافة عنصر غذائي جديد'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">اسم العنصر</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">الكمية القياسية</label>
            <input
              type="number"
              value={formData.standardServing}
              onChange={(e) => setFormData({ ...formData, standardServing: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">الوحدة</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">البروتين (جرام)</label>
            <input
              type="number"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: +e.target.value })}
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
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: +e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">الدهون (جرام)</label>
            <input
              type="number"
              value={formData.fats}
              onChange={(e) => setFormData({ ...formData, fats: +e.target.value })}
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
            {editingProperty ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">خصائص التغذية</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            إضافة عنصر غذائي
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    اسم العنصر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الكمية القياسية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    السعرات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    البروتين
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الكربوهيدرات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الدهون
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.standardServing} {property.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.calories}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.protein}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.carbs}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.fats}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <button
                          onClick={() => {
                            setFormData(property);
                            setEditingProperty(property);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <PropertyDialog 
          isOpen={isAddDialogOpen || !!editingProperty} 
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingProperty(null);
            setFormData({
              name: '',
              standardServing: 100,
              unit: 'جرام',
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0
            });
          }}
        />
      </div>
    </DashboardLayout>
  );
}; 