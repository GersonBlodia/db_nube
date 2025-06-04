import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text", placeholder: "usuario o correo" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Intentando autenticar:", { username: credentials?.username });
        
        if (!credentials?.username || !credentials.password) {
          console.log("❌ Credenciales faltantes");
          return null;
        }

        try {
          // Buscar usuario por username OR correo
          const usuario = await prisma.usuario.findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { 
                  persona: {
                    correo: credentials.username
                  } 
                }
              ]
            },
            include: { 
              persona: true,
              tipoUsuario: true 
            },
          });

          console.log("👤 Usuario encontrado:", usuario ? "Sí" : "No");

          if (!usuario) {
            console.log("❌ Usuario no encontrado para:", credentials.username);
            return null;
          }

          // Verificar contraseña
          console.log("🔒 Verificando contraseña...");
          const isValid = await bcrypt.compare(credentials.password, usuario.contrasena);
          
          console.log("✅ Contraseña válida:", isValid);

          if (!isValid) {
            console.log("❌ Contraseña incorrecta");
            return null;
          }

          // Datos del usuario para la sesión
          const userData = {
            id: usuario.id.toString(),
            email: usuario.persona.correo,
            name: usuario.persona.nombre 
              ? `${usuario.persona.nombre} ${usuario.persona.apellido}`.trim()
              : usuario.persona.correo,
            username: usuario.username,
            tipoUsuario: usuario.tipoUsuario?.nombre || 'Usuario'
          };

          console.log("✅ Autenticación exitosa:", { 
            id: userData.id, 
            email: userData.email,
            name: userData.name 
          });

          return userData;

        } catch (error) {
          console.error("💥 Error en autenticación:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.tipoUsuario = user.tipoUsuario;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          username: token.username as string,
          tipoUsuario: token.tipoUsuario as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === 'development', // Habilitar debug en desarrollo
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };