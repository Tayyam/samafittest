import { useState, useCallback } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useNutritionProperties } from '../../hooks/useNutritionProperties';
import { NutritionPropertiesTable } from '../../components/admin/nutrition/NutritionPropertiesTable';
import { NutritionPropertyForm } from '../../components/admin/nutrition/NutritionPropertyForm';
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

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      standardServing: 100,
      unit: 'جرام',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, formData);
        setEditingProperty(null);
      } else {
        await addProperty(formData);
        setIsAddDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  }, []);

  const handleEdit = useCallback((property: NutritionProperty) => {
    setFormData(property);
    setEditingProperty(property);
  }, []);

  const handleClose = useCallback(() => {
    setIsAddDialogOpen(false);
    setEditingProperty(null);
    resetForm();
  }, [resetForm]);

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
          <NutritionPropertiesTable
            properties={properties}
            onEdit={handleEdit}
            onDelete={deleteProperty}
          />
        )}

        <Dialog 
          isOpen={isAddDialogOpen || !!editingProperty} 
          onClose={handleClose}
          title={editingProperty ? 'تعديل عنصر غذائي' : 'إضافة عنصر غذائي جديد'}
        >
          <NutritionPropertyForm
            formData={formData}
            isEditing={!!editingProperty}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
            onClose={handleClose}
          />
        </Dialog>
      </div>
    </DashboardLayout>
  );
}; 