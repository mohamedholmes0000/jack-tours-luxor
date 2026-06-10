import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma, tryDatabase } from "@/lib/data/safe-db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const user = await tryDatabase(
          async () => prisma.adminUser.findUnique({ where: { email } }),
          null,
        );

        if (user && (await bcrypt.compare(password, user.password))) {
          return { id: user.id, email: user.email, name: user.name };
        }

        if (
          process.env.NODE_ENV !== "production" &&
          email === "admin@jacktoursluxor.com" &&
          password === "Admin2024!"
        ) {
          return { id: "dev-admin", email, name: "Jack Egypt Tour Admin" };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
