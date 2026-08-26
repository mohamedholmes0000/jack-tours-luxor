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

        if (user && !user.active) {
          return null;
        }

        if (user && user.active && (await bcrypt.compare(password, user.password))) {
          await tryDatabase(
            async () => prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
            null,
          );

          return { id: user.id, email: user.email, name: user.name, role: user.role, active: user.active };
        }

        if (
          process.env.NODE_ENV !== "production" &&
          email === "admin@jacktoursluxor.com" &&
          password === "Admin2024!"
        ) {
          return { id: "dev-admin", email, name: "Jack Luxor Tour Admin", role: "SUPER_ADMIN", active: true };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.active = user.active;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.active = token.active;
      }
      return session;
    },
  },
};
