"use client"
import { 
  Calendar, 
  Home, 
  BarChart2, 
  Inbox, 
  CheckCircle, 
  Coffee, 
  X, 
    
  ChevronRight, 
  
 
  Settings,
  LogOut,
  Folder,
  File
} from 'lucide-react';
import { motion  } from 'framer-motion';
import React, { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSidebarStore } from '@/store/useSiderStore';

interface SubItem {
  id: string;
  name: string;
  type: 'file';
}

interface Project {
  id: string;
  name: string;
  color: string;
  type: 'folder' | 'file';
  subItems?: SubItem[];
}

 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
export const SidebarComponent = () => {
  const { setSidebarOpen, sidebarOpen } = useSidebarStore();
  
  const [selectedId, setSelectedId] = React.useState<string | null>("folder1");
  
  const projects: Project[] = [
    {
      id: "folder1",
      name: "Menú Principal",
      color: "bg-amber-500",
      type: "folder",
      subItems: [
        { id: "file1", name: "Entradas", type: "file" },
        { id: "file2", name: "Platos Principales", type: "file" },
        { id: "file3", name: "Postres", type: "file" }
      ]
    },
    {
      id: "folder2",
      name: "Bebidas",
      color: "bg-blue-500",
      type: "folder",
      subItems: [
        { id: "file4", name: "Vinos", type: "file" },
        { id: "file5", name: "Cócteles", type: "file" }
      ]
    },
    {
      id: "file6",
      name: "Eventos Especiales",
      color: "bg-green-500",
      type: "file"
    },
    {
      id: "file7",
      name: "Personal",
      color: "bg-purple-500",
      type: "file"
    }
  ];
  
  const handleSelectItem = (id: string) => {
    setSelectedId(id);
  };
  
  
 
  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <motion.div
        initial={{ x: sidebarOpen ? 0 : -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
        className="w-72 h-full bg-white fixed top-0 left-0 z-50 border-r border-gray-200 flex flex-col shadow-lg"
      >
        {/* User profile */}
        <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 ring-2 ring-white">
                <span className="text-sm font-medium text-white">CM</span>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">Chef Martínez</p>
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="p-4 flex-1 overflow-y-auto scrollbar-thin">
          <nav className="space-y-1.5">
            <a className="flex items-center space-x-3 text-blue-600 bg-blue-50 px-3 py-2.5 rounded-lg font-medium transition-all" href="#">
              <Home size={20} />
              <span>Inicio</span>
            </a>
            <a className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-all" href="#">
              <Coffee size={20} />
              <span>Menú</span>
            </a>
            <a className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-all" href="#">
              <CheckCircle size={20} />
              <span>Mis tareas</span>
            </a>
            <a className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-all" href="#">
              <Inbox size={20} />
              <span>Bandeja</span>
              <Badge className="ml-auto bg-blue-500 hover:bg-blue-600">3</Badge>
            </a>
            <a className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-all" href="#">
              <Calendar size={20} />
              <span>Calendario</span>
            </a>
            <a className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-all" href="#">
              <BarChart2 size={20} />
              <span>Reportes</span>
            </a>
          </nav>
          
          {/* Projects with dropdown */}
          <div className="space-y-1 px-2 py-2">
      <Accordion type="multiple" className="space-y-1">
        {projects.map((project) => {
          const isSelected = selectedId === project.id;
          
          if (project.type === 'folder' && project.subItems && project.subItems.length > 0) {
            return (
              <AccordionItem 
                key={project.id} 
                value={project.id}
                className="border-0"
              >
                <div className={cn(
                  "flex items-center rounded-md mb-1 group transition-all",
                  isSelected ? "bg-amber-100" : "hover:bg-gray-100"
                )}>
                  <AccordionTrigger className="flex items-center py-2 px-3 flex-1 no-underline hover:no-underline">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                      <div className={cn(
                        "flex items-center justify-center w-5 h-5 transition-colors",
                        isSelected ? "text-amber-600" : "text-gray-500 group-hover:text-amber-500"
                      )}>
                        <Folder size={18} />
                      </div>
                      <span className={cn(
                        "font-medium", 
                        isSelected ? "text-amber-800" : "text-gray-700"
                      )}>
                        {project.name}
                      </span>
                    </div>
                  </AccordionTrigger>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 mr-2 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all">
                        <ChevronRight size={16} className="text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem>Renombrar</DropdownMenuItem>
                      <DropdownMenuItem>Mover</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <AccordionContent className="pb-0 pt-1">
                  <div className="ml-6 pl-3 border-l border-gray-200 space-y-1">
                    {project.subItems.map((subItem) => {
                      const isSubItemSelected = selectedId === subItem.id;
                      
                      return (
                        <div 
                          key={subItem.id}
                          onClick={() => handleSelectItem(subItem.id)}
                          className={cn(
                            "flex items-center space-x-3 rounded-md py-2 px-3 cursor-pointer transition-all",
                            isSubItemSelected 
                              ? "bg-amber-100 text-amber-800" 
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-5 h-5 transition-colors",
                            isSubItemSelected ? "text-amber-600" : "text-gray-500"
                          )}>
                            <File size={16} />
                          </div>
                          <span className="text-sm font-medium">{subItem.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          } else {
            // Regular file item (not a folder)
            return (
              <div 
                key={project.id}
                onClick={() => handleSelectItem(project.id)}
                className={cn(
                  "flex items-center space-x-3 rounded-md py-2 px-3 cursor-pointer group transition-all",
                  isSelected 
                    ? "bg-amber-100 text-amber-800" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 transition-colors",
                  isSelected ? "text-amber-600" : "text-gray-500 group-hover:text-amber-500"
                )}>
                  <File size={18} />
                </div>
                <span className="font-medium">{project.name}</span>
                
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all">
                        <ChevronRight size={16} className="text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem>Renombrar</DropdownMenuItem>
                      <DropdownMenuItem>Mover</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          }
        })}
      </Accordion>
    </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Settings size={18} className="mr-2" />
              Configuración
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <LogOut size={18} className="mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};