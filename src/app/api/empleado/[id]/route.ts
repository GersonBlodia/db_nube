import { prisma } from '@/libs/db'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const empleado = await prisma.empleado.findUnique({
    where: { id: Number(params.id) },
    include: { persona: true }
  })

  if (!empleado) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(empleado)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const data = await req.json()

  try {
    const empleado = await prisma.empleado.update({
      where: { id: Number(params.id) },
      data
    })
    return NextResponse.json(empleado)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.empleado.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ mensaje: 'Empleado eliminado' })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
