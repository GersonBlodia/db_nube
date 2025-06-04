'use client';

import { useState, useTransition, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginComponent() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const message = searchParams.get('message');

  // Manejar mensajes de éxito del registro
  useEffect(() => {
    if (message === 'registration-success') {
      setSuccessMessage('¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.');
      // Limpiar el parámetro de la URL después de mostrarlo
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('message');
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [message, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.username || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    startTransition(async () => {
      try {
        console.log('🔄 Iniciando proceso de login...');
        
        const result = await signIn('credentials', {
          username: formData.username.trim(),
          password: formData.password,
          redirect: false,
        });

        console.log('📋 Resultado de signIn:', result);

        if (result?.error) {
          console.log('❌ Error en signIn:', result.error);
          setError('Credenciales incorrectas. Verifica tu usuario/correo y contraseña.');
        } else if (result?.ok) {
          console.log('✅ SignIn exitoso, verificando sesión...');
          
          // Verificar que la sesión se haya creado correctamente
          const session = await getSession();
          console.log('👤 Sesión obtenida:', session);
          
          if (session) {
            console.log('🚀 Redirigiendo a:', callbackUrl);
            router.push(callbackUrl);
            router.refresh();
          } else {
            console.log('❌ No se pudo obtener la sesión');
            setError('Error al iniciar sesión. Intenta nuevamente.');
          }
        } else {
          console.log('❓ Resultado inesperado:', result);
          setError('Error inesperado. Intenta nuevamente.');
        }
      } catch (error) {
        console.error('💥 Error durante el login:', error);
        setError('Error de conexión. Intenta nuevamente.');
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-gray-600">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario o Correo
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ingresa tu usuario o correo"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !formData.username || !formData.password}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a
                href="/auth/register"
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors inline-flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                Regístrate aquí
              </a>
            </p>
            
            <p className="text-sm text-gray-600">
              ¿Problemas para acceder?{' '}
              <button 
                type="button"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
                onClick={() => {
                  // Aquí puedes agregar lógica para recuperar contraseña
                  console.log('Recuperar contraseña');
                }}
              >
                Contacta soporte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}