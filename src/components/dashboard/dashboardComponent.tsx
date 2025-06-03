"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {   Calendar,  Users, Coffee, DollarSign, Star,    Plus,   } from 'lucide-react';
 
// Componentes de shadcn/ui
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
 
import { Progress } from '@/components/ui/progress';
import { HeaderComponent } from './HeaderComponent';

export const RestaurantDashboard = () => {
  
  const [currentSection, setCurrentSection] = useState('in-progress');
  
  // Fecha actual formateada manualmente
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const today = new Date();
  const formattedDate = `${diasSemana[today.getDay()].substring(0, 3)}, ${meses[today.getMonth()]} ${today.getDate()}`;
  
  // Tasks para la demo
  const inProgressTasks = [
    { id: 1, name: "Revisar inventario de cocina", priority: "high", dueDate: "Hoy" },
    { id: 2, name: "Enviar pedido al proveedor", priority: "low", dueDate: "3 días" },
    { id: 3, name: "Elaborar menú semanal", priority: "low", dueDate: "5 días" },
  ];
  
  const todoTasks = [
    { id: 4, name: "Capacitación nuevo personal", priority: "medium", dueDate: "Mañana" },
  ];
  
  // Metricas del restaurante
  const metrics = [
    { id: 1, title: "Ventas Diarias", value: "$3,450", icon: <DollarSign className="text-emerald-500" />, trend: "+12%", color: "bg-emerald-50" },
    { id: 2, title: "Reservaciones", value: "24", icon: <Users className="text-blue-500" />, trend: "+8%", color: "bg-blue-50" },
    { id: 3, title: "Pedidos Online", value: "37", icon: <Coffee className="text-amber-500" />, trend: "+23%", color: "bg-amber-50" },
    { id: 4, title: "Satisfacción", value: "4.8", icon: <Star className="text-purple-500" />, trend: "+0.2", color: "bg-purple-50" },
  ];
  
 

  // Animación de entrada para las cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
     <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
      <HeaderComponent/>
        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 capitalize">{formattedDate}</h2>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button variant="outline" size="sm" className="text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Calendario</span>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus size={16} className="mr-2" />
                  <span>Nueva tarea</span>
                </Button>
              </div>
            </div>
            
            {/* Metrics */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              {metrics.map((metric) => (
                <motion.div 
                  key={metric.id} 
                  variants={itemVariants}
                >
                  <Card className={`${metric.color} border-none shadow-sm p-4`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                        <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs font-medium text-green-600">{metric.trend}</span>
                          <span className="text-xs text-gray-500 ml-1">vs. ayer</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-white">
                        {metric.icon}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Tasks Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setCurrentSection('in-progress')}
                    className={`px-4 py-3 text-sm font-medium inline-flex items-center ${
                      currentSection === 'in-progress'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>EN PROGRESO</span>
                    <Badge className="ml-2 bg-gray-200 text-gray-800">{inProgressTasks.length}</Badge>
                  </button>
                  <button
                    onClick={() => setCurrentSection('to-do')}
                    className={`px-4 py-3 text-sm font-medium inline-flex items-center ${
                      currentSection === 'to-do'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>POR HACER</span>
                    <Badge className="ml-2 bg-gray-200 text-gray-800">{todoTasks.length}</Badge>
                  </button>
                </nav>
              </div>
              
              {/* Task Tables */}
              <div className="p-4">
                {currentSection === 'in-progress' && (
                  <div>
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-2 px-2">
                      <div className="col-span-7">Nombre</div>
                      <div className="col-span-2">Prioridad</div>
                      <div className="col-span-3">Fecha límite</div>
                    </div>
                    <div>
                      {inProgressTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-12 gap-4 items-center py-3 px-2 border-b border-gray-100 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <div className="col-span-7 flex items-center space-x-3">
                            <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <span className="text-gray-800">{task.name}</span>
                          </div>
                          <div className="col-span-2">
                            <Badge className={`
                              ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                              ${task.priority === 'medium' ? 'bg-amber-100 text-amber-800' : ''}
                              ${task.priority === 'low' ? 'bg-gray-100 text-gray-800' : ''}
                            `}>
                              {task.priority === 'high' ? 'Alta' : ''}
                              {task.priority === 'medium' ? 'Media' : ''}
                              {task.priority === 'low' ? 'Baja' : ''}
                            </Badge>
                          </div>
                          <div className="col-span-3 text-sm text-gray-600">
                            {task.dueDate === 'Hoy' ? (
                              <span className="text-red-600 font-medium">{task.dueDate}</span>
                            ) : (
                              <span>{task.dueDate}</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 mt-4">
                      <Plus size={16} className="mr-2" />
                      <span>Agregar tarea</span>
                    </Button>
                  </div>
                )}
                
                {currentSection === 'to-do' && (
                  <div>
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-2 px-2">
                      <div className="col-span-7">Nombre</div>
                      <div className="col-span-2">Prioridad</div>
                      <div className="col-span-3">Fecha límite</div>
                    </div>
                    <div>
                      {todoTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-12 gap-4 items-center py-3 px-2 border-b border-gray-100 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <div className="col-span-7 flex items-center space-x-3">
                            <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            </div>
                            <span className="text-gray-800">{task.name}</span>
                          </div>
                          <div className="col-span-2">
                            <Badge className={`
                              ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                              ${task.priority === 'medium' ? 'bg-amber-100 text-amber-800' : ''}
                              ${task.priority === 'low' ? 'bg-gray-100 text-gray-800' : ''}
                            `}>
                              {task.priority === 'high' ? 'Alta' : ''}
                              {task.priority === 'medium' ? 'Media' : ''}
                              {task.priority === 'low' ? 'Baja' : ''}
                            </Badge>
                          </div>
                          <div className="col-span-3 text-sm text-gray-600">
                            {task.dueDate}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 mt-4">
                      <Plus size={16} className="mr-2" />
                      <span>Agregar tarea</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ventas diarias */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Ventas diarias</h3>
                  <Button variant="outline" size="sm">Esta semana</Button>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {/* Placeholder para gráfico */}
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 flex space-x-1">
                      {[40, 65, 50, 80, 60, 75, 90].map((height, i) => (
                        <div key={i} className="flex-1 flex items-end">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="w-full bg-blue-500 rounded-t-sm"
                          ></motion.div>
                        </div>
                      ))}
                    </div>
                    <div className="h-6 flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Lun</span>
                      <span>Mar</span>
                      <span>Mié</span>
                      <span>Jue</span>
                      <span>Vie</span>
                      <span>Sáb</span>
                      <span>Dom</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Productos populares */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Platos populares</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600">Ver todos</Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Pasta Carbonara</p>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Salmón a la parrilla</p>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Risotto de setas</p>
                      <span className="text-sm font-medium">52%</span>
                    </div>
                    <Progress value={52} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Tiramisú</p>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2 mt-1" />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Últimas secciones: Reservas y Mesas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Reservas recientes */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Reservas recientes</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600">Ver todas</Button>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "María García", time: "19:30", guests: 4, status: "confirmed" },
                    { name: "Juan Pérez", time: "20:00", guests: 2, status: "pending" },
                    { name: "Ana López", time: "20:30", guests: 6, status: "confirmed" }
                  ].map((reservation, i) => (
                    <div key={i} className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{reservation.name}</p>
                        <p className="text-xs text-gray-500 truncate">{reservation.time} · {reservation.guests} personas</p>
                      </div>
                      <Badge className={reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                        {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Estado de mesas */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Estado de mesas</h3>
                  <Button variant="outline" size="sm">Ver plano</Button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[
                    { id: 1, status: 'occupied', time: '19:10' },
                    { id: 2, status: 'available' },
                    { id: 3, status: 'reserved', time: '20:00' },
                    { id: 4, status: 'occupied', time: '18:45' },
                    { id: 5, status: 'available' },
                    { id: 6, status: 'occupied', time: '19:30' },
                    { id: 7, status: 'cleaning' },
                    { id: 8, status: 'available' }
                  ].map((table) => (
                    <div key={table.id} className="relative">
                      <div 
                        className={`
                          aspect-square rounded-md p-3 flex items-center justify-center
                          ${table.status === 'available' ? 'bg-green-100 text-green-700' : ''}
                          ${table.status === 'occupied' ? 'bg-red-100 text-red-700' : ''}
                          ${table.status === 'reserved' ? 'bg-blue-100 text-blue-700' : ''}
                          ${table.status === 'cleaning' ? 'bg-amber-100 text-amber-700' : ''}
                        `}
                      >
                        <div className="text-center">
                          <p className="font-semibold">{table.id}</p>
                          {table.time && (
                            <p className="text-xs mt-1">{table.time}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 space-x-6 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Ocupada</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Reservada</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Limpieza</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
  );
};

 