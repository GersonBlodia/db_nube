import { prisma } from '@/libs/db'
import { NextResponse } from 'next/server'
 
export async function GET() {
  const personas = await prisma.persona.findMany({
    include: { usuario: true, empleado: true }
  })
  return NextResponse.json(personas)
}

export async function POST(req: Request) {
  const data = await req.json()

  const persona = await prisma.persona.create({
    data
  })

  return NextResponse.json(persona, { status: 201 })
}
