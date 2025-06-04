'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, IdCard } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { clsx } from 'clsx';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalInfo } from '@/schema/schema';
 

interface PersonalInfoStepProps {
  form: UseFormReturn<PersonalInfo>;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export function PersonalInfoStep({ form, className }: PersonalInfoStepProps) {
  const { register, formState: { errors } } = form;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={clsx('w-full', className)}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <motion.div
            variants={itemVariants}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Información Personal
          </CardTitle>
          <p className="text-muted-foreground">
            Ingresa tus datos personales para continuar
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Nombre y Apellido en fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Nombre
              </Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Ingresa tu nombre"
                className={clsx(
                  'transition-all duration-300 focus:ring-2 focus:ring-blue-500/20',
                  errors.nombre && 'border-red-500 focus:ring-red-500/20'
                )}
              />
              {errors.nombre && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  {errors.nombre.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="apellido" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Apellido
              </Label>
              <Input
                id="apellido"
                {...register('apellido')}
                placeholder="Ingresa tu apellido"
                className={clsx(
                  'transition-all duration-300 focus:ring-2 focus:ring-blue-500/20',
                  errors.apellido && 'border-red-500 focus:ring-red-500/20'
                )}
              />
              {errors.apellido && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.apellido.message}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* DNI */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="dni" className="text-sm font-medium flex items-center gap-2">
              <IdCard className="w-4 h-4 text-blue-500" />
              DNI
            </Label>
            <Input
              id="dni"
              {...register('dni')}
              placeholder="12345678"
              maxLength={8}
              className={clsx(
                'transition-all duration-300 focus:ring-2 focus:ring-blue-500/20',
                errors.dni && 'border-red-500 focus:ring-red-500/20'
              )}
            />
            {errors.dni && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.dni.message}
              </motion.p>
            )}
          </motion.div>

          {/* Correo */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="correo" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              Correo Electrónico
            </Label>
            <Input
              id="correo"
              type="email"
              {...register('correo')}
              placeholder="tu@correo.com"
              className={clsx(
                'transition-all duration-300 focus:ring-2 focus:ring-blue-500/20',
                errors.correo && 'border-red-500 focus:ring-red-500/20'
              )}
            />
            {errors.correo && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.correo.message}
              </motion.p>
            )}
          </motion.div>

          {/* Teléfono */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="telefono" className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              Teléfono <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="telefono"
              {...register('telefono')}
              placeholder="+51 999 999 999"
              className={clsx(
                'transition-all duration-300 focus:ring-2 focus:ring-blue-500/20',
                errors.telefono && 'border-red-500 focus:ring-red-500/20'
              )}
            />
            {errors.telefono && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.telefono.message}
              </motion.p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}