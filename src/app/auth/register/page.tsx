import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RegistrationWizard from '@/components/RegistrationWizard';
 
// Componente de loading
function RegistrationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Card skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 animate-pulse">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="flex justify-between items-center mt-8">
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default async function RegistrationPage() {
  // Verificar si el usuario ya está autenticado
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }

  return (
    <Suspense fallback={<RegistrationLoading />}>
      <RegistrationWizard />
    </Suspense>
  );
}

// Metadata para SEO
export const metadata = {
  title: 'Crear Cuenta | Tu App',
  description: 'Crea tu cuenta para acceder a todas las funcionalidades de la plataforma.',
  keywords: ['registro', 'crear cuenta', 'usuario nuevo'],
};