 
import { prisma } from '@/libs/db'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const persona = await prisma.persona.findUnique({
    where: { id: Number(params.id) },
    include: { usuario: true, empleado: true }
  })

  if (!persona) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  return NextResponse.json(persona)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const data = await req.json()

  try {
    const persona = await prisma.persona.update({
      where: { id: Number(params.id) },
      data
    })
    return NextResponse.json(persona)
  } catch (error: unknown) {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
}
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.persona.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ mensaje: 'Eliminado con éxito' })
  } catch (error: unknown) {
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
}
}
