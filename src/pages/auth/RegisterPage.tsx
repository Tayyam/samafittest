import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthCard } from '../../components/auth/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signUp } from '../../lib/firebase/auth';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await signUp(data.email, data.password, data.name);
      navigate('/dashboard');
    } catch (err) {
      setError('فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <AuthCard title="إنشاء حساب جديد">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="الاسم"
          {...register('name', {
            required: 'الاسم مطلوب',
            minLength: {
              value: 2,
              message: 'الاسم يجب أن يكون حرفين على الأقل'
            }
          })}
          error={errors.name?.message}
        />

        <Input
          label="البريد الإلكتروني"
          type="email"
          {...register('email', {
            required: 'البريد الإلكتروني مطلوب',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'البريد الإلكتروني غير صالح'
            }
          })}
          error={errors.email?.message}
        />

        <Input
          label="كلمة المرور"
          type="password"
          {...register('password', {
            required: 'كلمة المرور مطلوبة',
            minLength: {
              value: 6,
              message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
            }
          })}
          error={errors.password?.message}
        />

        <Input
          label="تأكيد كلمة المرور"
          type="password"
          {...register('confirmPassword', {
            required: 'تأكيد كلمة المرور مطلوب',
            validate: value => value === watch('password') || 'كلمات المرور غير متطابقة'
          })}
          error={errors.confirmPassword?.message}
        />

        {error && (
          <div className="text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري التسجيل...' : 'إنشاء حساب'}
        </Button>

        <div className="text-sm text-center">
          <Link to="/login" className="text-sama-dark hover:underline">
            لديك حساب بالفعل؟ سجل دخولك
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};