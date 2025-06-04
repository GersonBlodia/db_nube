import { prisma } from '@/libs/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: { 
        persona: true, 
        tipoUsuario: true 
      }
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validar que se proporcione una contraseña
    if (!data.contrasena) {
      return NextResponse.json(
        { error: 'La contraseña es requerida' }, 
        { status: 400 }
      );
    }

    // Verificar si el username ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { username: data.username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya existe' }, 
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.contrasena, saltRounds);

    // Crear el usuario con la contraseña hasheada
    const usuario = await prisma.usuario.create({
      data: {
        ...data,
        contrasena: hashedPassword
      },
      include: {
        persona: true,
        tipoUsuario: true
      }
    });

   
    return NextResponse.json(usuario, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Error al crear el usuario' }, 
      { status: 500 }
    );
  }
}