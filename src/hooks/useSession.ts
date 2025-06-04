import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  tipoUsuario: string;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut({ 
      redirect: false,
      callbackUrl: '/auth/login' 
    });
    router.push('/auth/login');
    router.refresh();
  };

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user as AuthUser | undefined;

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    session,
  };
}