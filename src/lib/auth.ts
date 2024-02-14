
import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/utils";

export const authOption: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try
        {
          if (!credentials?.email || !credentials?.password)
            return null
          
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
          
          if (!existingUser) {
            return null
          }

          const passwordMatch = generateHash(credentials?.password) === existingUser.password
          if (!passwordMatch) {
            return null
          }
          
          return {
            id: existingUser.id,
            email: existingUser.email,
          };
        } catch (error) {
          console.error(error)
          return null;
        }
      },
    }),
    Credentials({
      id: 'wallet',
      name: 'wallet',
      credentials: {
        wallet: { label: 'Wallet Address', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.wallet)
            return null

          const walletData = await prisma.wallet.findUnique({
            where: {
              address: credentials?.wallet
            },
            include: {
              user: true
            }
          });

          if (!walletData?.user) {
            return null
          }

          return {
            id: walletData?.user.id,
            email: walletData?.user.email,
            wallet: credentials.wallet
          }
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
        };
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
};
