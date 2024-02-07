
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/utils";

export const authConfig: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        encrypt: { label: "Encrypt", type: "boolean" },
      },
      async authorize(credentials) {
        try
        {
          if (!credentials?.email || !credentials?.password)
            return null

          prisma.$connect()
          
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
          
          if (!existingUser) {
            return null
          }

          const passwordMatch = credentials.encrypt?credentials?.password:generateHash(credentials?.password) === existingUser.password
          if (!passwordMatch) {
            return null
          }
          
          return {
            id: `${existingUser.id}`,
            email: existingUser.email,
          };
        } catch (error) {
          console.error(error)
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          email: token.email,
        },
      };
    },
  },
};

