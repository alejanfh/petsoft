import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { authSchema } from "./validations";

/* ESTO ES EL AUTH-NO-EDGE ANTES DEL CAMBIO */

const config = {
  // How nextauth should run
  // Por defecto te da una pagina logIn y signUp, pero nosotros ya tenemos esas pages
  // no hay /signUp porque se supone que lo tienes que hacer tu, sin cookies ni nada
  pages: {
    signIn: "/login",
  },

  // User logs in and does not have to log in every time enters the app (sesion activa por 1 semana)
  session: {
    maxAge: 30 * 24 * 60 * 60, // Sesión activa solo por 30 dias
    strategy: "jwt", // database/jwt forma de authentication
  },

  // Determine how users can login (Google, Github,...)
  // This will run up every log in attempt
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login
        // validation
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        const { email, password } = validatedFormData.data;

        // voy a la bd para mirar si el email de este user existe
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        // si no hay usuario, significa que no ha hecho login/no existe
        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        // si las password no son iguales, no le dejamos hacer login
        if (!passwordsMatch) {
          console.log("Invalid password");
          return null;
        }

        // si llega aquí significa que hay user y las passwords match
        return user;
      },
    }),
  ],

  // If user is attempting to login
  callbacks: {
    // function that will determine ifthe user enters or not

    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user); // si el usuario existe, significa que esta logeado
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app"); //return false if the user tries to go to /app (/app/dashboard, /app/account)

      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }

      if (!isTryingToAccessApp) {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

// This is going to have the logic for authenticating users
export const { auth, signIn } = NextAuth(config);
