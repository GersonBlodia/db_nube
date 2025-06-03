 
"use client"

import { SidebarComponent } from '@/components/dashboard/SideBarComponent';
import { useSidebarStore } from '@/store/useSiderStore';
import { ReactNode, useEffect, useState } from 'react';

export default function LayoutPageDashboard({ children }: { children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  // Estado para el tamaño de la ventana
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla para ajustar el sidebar automáticamente
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Ejecutar al inicio
    checkScreenSize();
    
    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', checkScreenSize);
    
    // Limpiar event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setSidebarOpen]);
  return (
    <main  className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-72' : ''
        }`}>
         <SidebarComponent/>
       {children} 
    </main>
  );
}
