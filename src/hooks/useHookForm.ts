import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationData } from '@/schema/schema';
 

interface RegistrationState {
  success: boolean;
  error: string;
  isLoading: boolean;
}

interface RegistrationHook {
  state: RegistrationState;
  register: (data: RegistrationData) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

export function useRegistration(): RegistrationHook {
  const [state, setState] = useState<RegistrationState>({
    success: false,
    error: '',
    isLoading: false
  });
  
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const register = async (data: RegistrationData) => {
    setState(prev => ({ ...prev, isLoading: true, error: '', success: false }));

    startTransition(async () => {
      try {
        // 1. Crear persona
        const personaResponse = await fetch('/api/persona', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            correo: data.correo,
            telefono: data.telefono || null
          })
        });

        if (!personaResponse.ok) {
          const errorData = await personaResponse.json();
          throw new Error(errorData.error || 'Error al registrar información personal');
        }

        const persona = await personaResponse.json();

        // 2. Crear usuario
        const usuarioResponse = await fetch('/api/usuario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personaId: persona.id,
            username: data.username,
            contrasena: data.contrasena,
            tipoUsuarioId: data.tipoUsuarioId
          })
        });

        if (!usuarioResponse.ok) {
          const errorData = await usuarioResponse.json();
          throw new Error(errorData.error || 'Error al crear cuenta de usuario');
        }

        setState(prev => ({ ...prev, success: true, isLoading: false }));

        // Redirigir después de un breve delay para mostrar el mensaje de éxito
        setTimeout(() => {
          router.push('/auth/log?message=registration-success');
        }, 2000);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setState(prev => ({ 
          ...prev, 
          error: errorMessage, 
          isLoading: false,
          success: false 
        }));
      }
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: '' }));
  };

  const clearSuccess = () => {
    setState(prev => ({ ...prev, success: false }));
  };

  return {
    state: {
      ...state,
      isLoading: state.isLoading || isPending
    },
    register,
    clearError,
    clearSuccess
  };
}