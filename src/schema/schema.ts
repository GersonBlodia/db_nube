import { z } from 'zod';

// Esquema para información personal
export const personalInfoSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  
  apellido: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),
  
  dni: z
    .string()
    .length(8, 'El DNI debe tener exactamente 8 dígitos')
    .regex(/^\d{8}$/, 'El DNI solo puede contener números'),
  
  correo: z
    .string()
    .email('Ingresa un correo válido')
    .min(1, 'El correo es requerido'),
  
  telefono: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s\-()]+$/.test(val),
      'Formato de teléfono inválido'
    )
});

// Esquema base para credenciales (sin confirmación)
const credentialsBaseSchema = z.object({
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(20, 'El usuario no puede exceder 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El usuario solo puede contener letras, números y guiones bajos'),
  
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  tipoUsuarioId: z
    .coerce
    .number()
    .min(1, 'Selecciona un tipo de usuario válido')
});

// Esquema para credenciales con confirmación (para el formulario)
export const credentialsSchema = credentialsBaseSchema.extend({
  confirmarContrasena: z.string()
}).refine((data) => data.contrasena === data.confirmarContrasena, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarContrasena']
});

// Esquema completo para registro (sin confirmación de contraseña)
export const fullRegistrationSchema = z.object({
  // Información personal
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  
  apellido: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),
  
  dni: z
    .string()
    .length(8, 'El DNI debe tener exactamente 8 dígitos')
    .regex(/^\d{8}$/, 'El DNI solo puede contener números'),
  
  correo: z
    .string()
    .email('Ingresa un correo válido')
    .min(1, 'El correo es requerido'),
  
  telefono: z
    .string()
    .optional(),
  
  // Credenciales
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(20, 'El usuario no puede exceder 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El usuario solo puede contener letras, números y guiones bajos'),
  
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  tipoUsuarioId: z
    .coerce
    .number()
    .min(1, 'Selecciona un tipo de usuario válido')
});

// Tipos TypeScript
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Credentials = z.infer<typeof credentialsSchema>;
export type RegistrationData = z.infer<typeof fullRegistrationSchema>;

// Tipos de usuario predefinidos
export const USER_TYPES = [
  { id: 1, name: 'Usuario', description: 'Usuario estándar del sistema' },
  { id: 2, name: 'Administrador', description: 'Administrador con permisos completos' },
  { id: 3, name: 'Moderador', description: 'Moderador con permisos limitados' }
] as const;