import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { User } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
    } : {}
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
        </h2>

        <form className="space-y-4">
          <Input
            label="الاسم"
            {...register('name', { required: 'هذا الحقل مطلوب' })}
            error={errors.name?.message}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            {...register('email', {
              required: 'هذا الحقل مطلوب',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'بريد إلكتروني غير صالح'
              }
            })}
            error={errors.email?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الدور
            </label>
            <select
              {...register('role', { required: 'هذا الحقل مطلوب' })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sama-light focus:ring-sama-light"
            >
              <option value="member">مشترك</option>
              <option value="trainer">مدرب</option>
              <option value="admin">مدير</option>
            </select>
            {errors.role?.message && (
              <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {!user && (
            <Input
              label="كلمة المرور"
              type="password"
              {...register('password', {
                required: 'هذا الحقل مطلوب',
                minLength: {
                  value: 6,
                  message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                }
              })}
              error={errors.password?.message}
            />
          )}

          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button type="button" variant="secondary" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">
              {user ? 'حفظ التغييرات' : 'إضافة المستخدم'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};