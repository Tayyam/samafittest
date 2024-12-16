import { Pencil, Trash2 } from 'lucide-react';
import type { NutritionProperty } from '../../../types';

interface NutritionPropertiesTableProps {
  properties: NutritionProperty[];
  onEdit: (property: NutritionProperty) => void;
  onDelete: (id: string) => void;
}

export const NutritionPropertiesTable = ({
  properties,
  onEdit,
  onDelete
}: NutritionPropertiesTableProps) => {
  return (
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
                    onClick={() => onEdit(property)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(property.id)}
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
  );
}; 