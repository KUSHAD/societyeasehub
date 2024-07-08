import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";

import Google from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [Google],
  adapter: PrismaAdapter(db),
  debug: env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "light",
    logo: "/favicon.png",
    brandColor: "#18181b",
  },
  pages: {
    error: "/auth",
    signIn: "/auth",
    signOut: "/",
  },
  trustHost: true,
});
