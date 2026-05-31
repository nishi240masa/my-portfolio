import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      if (ADMIN_EMAILS.length === 0) return false;
      return ADMIN_EMAILS.includes(email);
    },
    async session({ session }) {
      const email = session.user?.email?.toLowerCase();
      if (!email || !ADMIN_EMAILS.includes(email)) {
        return { ...session, user: undefined as never };
      }
      return session;
    },
  },
});
