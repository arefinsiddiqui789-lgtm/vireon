import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.error("Auth Error: Missing credentials");
          throw new Error("Email and password are required");
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            console.error("Auth Error: User not found:", credentials.email);
            throw new Error("No account found with this email");
          }

          if (!user.password) {
            console.error("Auth Error: Password missing for user (likely OAuth account)");
            throw new Error("This account uses a different sign-in method");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            console.error("Auth Error: Invalid password for:", credentials.email);
            throw new Error("Incorrect password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error: any) {
          console.error("Auth Global Error:", error.message);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
  debug: process.env.NODE_ENV === "development",
};
