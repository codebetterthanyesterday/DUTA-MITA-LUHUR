import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: `/${process.env.ADMIN_ROUTE_SLUG}/login`,
  },
  session: { strategy: "jwt" },
  providers: [], // populated in auth.ts
};
