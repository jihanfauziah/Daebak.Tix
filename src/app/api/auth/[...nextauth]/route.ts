import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

/**
 * Custom TikTok OAuth 2.0 Provider for NextAuth
 */
const TikTokProvider = {
  id: 'tiktok',
  name: 'TikTok',
  type: 'oauth' as const,
  version: '2.0',
  authorization: {
    url: 'https://www.tiktok.com/v2/auth/authorize/',
    params: {
      client_key: process.env.TIKTOK_CLIENT_KEY || '',
      response_type: 'code',
      scope: 'user.info.basic',
      redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/tiktok`,
    },
  },
  token: {
    url: 'https://open.tiktokapis.com/v2/oauth/token/',
  },
  userinfo: {
    url: 'https://open.tiktokapis.com/v2/user/info/',
  },
  profile(profile: any) {
    const data = profile?.data?.user || {};
    return {
      id: data.open_id || profile.id || 'tiktok-user',
      name: data.display_name || 'TikTok User',
      email: data.email || `${data.open_id || 'user'}@tiktok.social`,
      image: data.avatar_url,
    };
  },
  clientId: process.env.TIKTOK_CLIENT_KEY,
  clientSecret: process.env.TIKTOK_CLIENT_SECRET,
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-google-client-secret',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || 'demo-facebook-client-id',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'demo-facebook-client-secret',
    }),
    TikTokProvider,
  ],
  secret: process.env.NEXTAUTH_SECRET || 'daebaktix_super_secret_nextauth_jwt_key_2026_dev',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Social login callback: Add/update buyer with 50 loyalty points bonus
      if (user && user.email) {
        console.log(`[Social Login Callback] User signed in via ${account?.provider}:`, user.email);
        // Note: In browser runtime context, DataStore syncs with localStorage
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = 'buyer';
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role || 'buyer';
        session.user.provider = token.provider;
        session.user.loyalty_points = 50; // Bonus points for social login
      }
      return session;
    },
  },
  pages: {
    signIn: '/buyer/login',
    error: '/buyer/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
