 
import { prisma } from '@/libs/db'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(params.id) },
    include: { persona: true, tipoUsuario: true }
  })

  if (!usuario) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(usuario)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const data = await req.json()

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(params.id) },
      data
    })
    return NextResponse.json(usuario)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.usuario.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ mensaje: 'Usuario eliminado' })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
