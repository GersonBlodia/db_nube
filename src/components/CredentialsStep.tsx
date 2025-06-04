'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Key, UserCircle, Check, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { clsx } from 'clsx';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 
import { Credentials, USER_TYPES } from '@/schema/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
 

interface CredentialsStepProps {
  form: UseFormReturn<Credentials>;
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

export function CredentialsStep({ form, className }: CredentialsStepProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const password = watch('contrasena');
  const confirmPassword = watch('confirmarContrasena');

  // Validaciones de contraseña en tiempo real
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ''),
    lowercase: /[a-z]/.test(password || ''),
    number: /\d/.test(password || ''),
    match: password === confirmPassword && password?.length > 0
  };

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
            className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Credenciales de Acceso
          </CardTitle>
          <p className="text-muted-foreground">
            Configura tu usuario y contraseña
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Username */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-purple-500" />
              Nombre de Usuario
            </Label>
            <Input
              id="username"
              {...register('username')}
              placeholder="usuario123"
              className={clsx(
                'transition-all duration-300 focus:ring-2 focus:ring-purple-500/20',
                errors.username && 'border-red-500 focus:ring-red-500/20'
              )}
            />
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.username.message}
              </motion.p>
            )}
          </motion.div>

          {/* Tipo de Usuario */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" />
              Tipo de Usuario
            </Label>
            <Select onValueChange={(value) => setValue('tipoUsuarioId', parseInt(value))}>
              <SelectTrigger className={clsx(
                'transition-all duration-300 focus:ring-2 focus:ring-purple-500/20',
                errors.tipoUsuarioId && 'border-red-500'
              )}>
                <SelectValue placeholder="Selecciona el tipo de usuario" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.name}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoUsuarioId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.tipoUsuarioId.message}
              </motion.p>
            )}
          </motion.div>

          {/* Contraseña */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="contrasena" className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-500" />
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="contrasena"
                type={showPassword ? 'text' : 'password'}
                {...register('contrasena')}
                placeholder="Tu contraseña segura"
                className={clsx(
                  'pr-10 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20',
                  errors.contrasena && 'border-red-500 focus:ring-red-500/20'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Indicadores de seguridad de contraseña */}
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-xs font-medium text-gray-700">Requisitos de contraseña:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={clsx(
                    'flex items-center gap-1',
                    passwordChecks.length ? 'text-green-600' : 'text-gray-400'
                  )}>
                    {passwordChecks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    8+ caracteres
                  </div>
                  <div className={clsx(
                    'flex items-center gap-1',
                    passwordChecks.uppercase ? 'text-green-600' : 'text-gray-400'
                  )}>
                    {passwordChecks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Mayúscula
                  </div>
                  <div className={clsx(
                    'flex items-center gap-1',
                    passwordChecks.lowercase ? 'text-green-600' : 'text-gray-400'
                  )}>
                    {passwordChecks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Minúscula
                  </div>
                  <div className={clsx(
                    'flex items-center gap-1',
                    passwordChecks.number ? 'text-green-600' : 'text-gray-400'
                  )}>
                    {passwordChecks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    Número
                  </div>
                </div>
              </motion.div>
            )}

            {errors.contrasena && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.contrasena.message}
              </motion.p>
            )}
          </motion.div>

          {/* Confirmar Contraseña */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="confirmarContrasena" className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-500" />
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmarContrasena"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmarContrasena')}
                placeholder="Confirma tu contraseña"
                className={clsx(
                  'pr-10 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20',
                  errors.confirmarContrasena && 'border-red-500 focus:ring-red-500/20',
                  passwordChecks.match && confirmPassword && 'border-green-500 focus:ring-green-500/20'
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {confirmPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  'flex items-center gap-1 text-xs',
                  passwordChecks.match ? 'text-green-600' : 'text-red-500'
                )}
              >
                {passwordChecks.match ? (
                  <>
                    <Check className="w-3 h-3" />
                    Las contraseñas coinciden
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3" />
                    Las contraseñas no coinciden
                  </>
                )}
              </motion.div>
            )}

            {errors.confirmarContrasena && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.confirmarContrasena.message}
              </motion.p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}