import { prisma } from '@/libs/db'
import { NextResponse } from 'next/server'
 
export async function GET() {
  const empleados = await prisma.empleado.findMany({
    include: { persona: true }
  })
  return NextResponse.json(empleados)
}

export async function POST(req: Request) {
  const data = await req.json()

  const empleado = await prisma.empleado.create({
    data
  })

  return NextResponse.json(empleado, { status: 201 })
}
