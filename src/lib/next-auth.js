import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.googleId = profile?.sub;
        token.picture = profile?.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.googleId = token.googleId;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: '/blog',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
});
