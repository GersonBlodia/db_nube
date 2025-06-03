import { prisma } from '@/libs/db'
import { NextResponse } from 'next/server'
 
export async function GET() {
  const tipos = await prisma.tipoUsuario.findMany({
    include: { usuarios: true }
  })
  return NextResponse.json(tipos)
}

export async function POST(req: Request) {
  const data = await req.json()

  const tipo = await prisma.tipoUsuario.create({
    data
  })

  return NextResponse.json(tipo, { status: 201 })
}
