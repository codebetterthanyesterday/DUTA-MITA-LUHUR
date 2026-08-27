import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: `/${process.env.ADMIN_ROUTE_SLUG}/login`,
  },
  session: { strategy: "jwt" },
  providers: [], // populated in auth.ts
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role;
      return session;
    },
  },
};
