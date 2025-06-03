'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

// Esquema de validación
const schema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  dni: z.string().length(8),
  correo: z.string().email(),
  telefono: z.string().optional(),
  contrasena: z.string().min(6),
  tipoUsuarioId: z.coerce.number()
})

type FormData = z.infer<typeof schema>

export default function RegistroPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    try {
      // 1. Crear persona
      const personaRes = await fetch('/api/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          correo: data.correo,
          telefono: data.telefono
        })
      })

      const persona = await personaRes.json()
      if (!persona.id) throw new Error('Error al registrar persona')

      // 2. Crear usuario
      const usuarioRes = await fetch('/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: persona.id,
          contrasena: data.contrasena,
          tipoUsuarioId: data.tipoUsuarioId
        })
      })

      const usuario = await usuarioRes.json()
      if (!usuario.id) throw new Error('Error al registrar usuario')

      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input {...register('nombre')} />
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
            </div>

            <div>
              <Label>Apellido</Label>
              <Input {...register('apellido')} />
              {errors.apellido && <p className="text-sm text-red-500">{errors.apellido.message}</p>}
            </div>

            <div>
              <Label>DNI</Label>
              <Input {...register('dni')} />
              {errors.dni && <p className="text-sm text-red-500">{errors.dni.message}</p>}
            </div>

            <div>
              <Label>Correo</Label>
              <Input type="email" {...register('correo')} />
              {errors.correo && <p className="text-sm text-red-500">{errors.correo.message}</p>}
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input {...register('telefono')} />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input type="password" {...register('contrasena')} />
              {errors.contrasena && <p className="text-sm text-red-500">{errors.contrasena.message}</p>}
            </div>

            <div>
              <Label>Tipo de Usuario (ID)</Label>
              <Input type="number" {...register('tipoUsuarioId')} />
              {errors.tipoUsuarioId && <p className="text-sm text-red-500">{errors.tipoUsuarioId.message}</p>}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
