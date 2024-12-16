import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthCard } from '../../components/auth/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signIn } from '../../lib/firebase/auth';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.');
    }
  };

  return (
    <AuthCard title="تسجيل الدخول">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          {isSubmitting ? 'جاري التسجيل...' : 'تسجيل الدخول'}
        </Button>

        <div className="text-sm text-center">
          <Link to="/register" className="text-sama-dark hover:underline">
            ليس لديك حساب؟ سجل الآن
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};