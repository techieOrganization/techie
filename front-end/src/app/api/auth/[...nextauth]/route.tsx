import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

import { cookieSet } from '@/libs/cookie';
NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          console.log('인증요청', credentials);
          const response = await axios.post(
            `http://localhost:8080/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          console.log('응답', response);
          const token = await response.headers['authorization']?.split(' ')[1];
          console.log(token);

          if (token) {
            cookieSet('token', token);
            return { token, email: credentials.email, id: '' };
          }
        } catch (error) {
          console.error('인증 오류:', error);
          return null;
        }

        return null;
      },
    }),
  ],
  debug: true,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export default NextAuth;
