import { prisma } from '@/libs/db'
import { NextResponse } from 'next/server'
 
export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    include: { persona: true, tipoUsuario: true }
  })
  return NextResponse.json(usuarios)
}

export async function POST(req: Request) {
  const data = await req.json()

  const usuario = await prisma.usuario.create({
    data
  })

  return NextResponse.json(usuario, { status: 201 })
}
