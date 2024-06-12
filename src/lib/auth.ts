import NextAuth, { NextAuthConfig } from "next-auth";
import { signIn } from "next-auth/react";

const config = {
  pages: {
    signIn: '/login'
  },
  providers: [],
  callbacks: {
    authorized: ({request}) => {
     const isTryingToAccessApp = request.nextUrl.pathname.includes('/app');
     if (isTryingToAccessApp) {
      return false;
     } else {
      return true;
     }
    }
  },
} satisfies NextAuthConfig;

export const {auth} = NextAuth(config);


