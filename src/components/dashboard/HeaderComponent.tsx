import React, { useState } from 'react';
import { Bell, Menu, LogOut, Settings, User, CalendarClock, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useSidebarStore } from "@/store/useSiderStore";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const HeaderComponent: React.FC = () => {
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nueva reservación',
      description: 'Mesa para 4 personas a las 8:00 PM',
      time: '10 min',
      read: false
    },
    {
      id: '2',
      title: 'Recordatorio',
      description: 'Reunión con proveedores a las 4:30 PM',
      time: '30 min',
      read: false
    },
    {
      id: '3',
      title: 'Pedido especial',
      description: 'Cliente solicita menú vegetariano personalizado',
      time: '1 hora',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white border-b border-gray-100 h-20 flex items-center px-6 md:px-8 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        className={`mr-4 ${sidebarOpen ? 'hidden' : 'block'} hover:bg-gray-100 transition-colors duration-200`}
      >
        <Menu size={24} className="text-gray-700" />
      </Button>
      
      <div className="flex-1">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-serif mr-3 text-lg">
            ED
          </div>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-gray-900">Bienvenido, Chef Martínez</h1>
            <p className="text-amber-600 font-medium">Restaurante El Dorado</p>
          </div>
        </div>
      </div>
      
      <div className="ml-auto flex items-center space-x-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 transition-colors duration-200 relative">
              <Bell size={22} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-medium text-lg">Notificaciones</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-amber-600 hover:text-amber-700">
                  Marcar todo como leído
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${notification.read ? 'opacity-70' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    {!notification.read && <div className="h-2 w-2 bg-amber-500 rounded-full absolute top-4 right-4"></div>}
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-gray-500">No hay notificaciones</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200 rounded-full pl-1 pr-3 py-1"
            >
              <Avatar className="h-9 w-9 border-2 border-amber-500">
                <AvatarImage src="/api/placeholder/36/36" alt="Chef Avatar" />
                <AvatarFallback className="bg-amber-100 text-amber-800">CM</AvatarFallback>
              </Avatar>
              <span className="text-gray-700 font-medium hidden md:inline">Chef Martínez</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Chef Martínez</p>
                <p className="text-xs text-gray-500">chef@eldorado.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4 text-amber-600" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-amber-600" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CalendarClock className="mr-2 h-4 w-4 text-amber-600" />
                <span>Reservaciones</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Star className="mr-2 h-4 w-4 text-amber-600" />
                <span>Especiales del Día</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HeaderComponent;