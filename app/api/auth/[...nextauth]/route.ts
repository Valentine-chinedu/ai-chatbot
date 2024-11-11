// app/api/auth/[...nextauth]/route.ts
import NextAuth, { Session, AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials) => {
				const user = await prisma.user.findUnique({
					where: { email: credentials?.email },
				});

				if (user) {
					// Cast the user ID to a string to match the expected NextAuth `User` type
					return {
						...user,
						id: user.id.toString(), // Convert Prisma `user.id` to a string
					};
				}
				return null;
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async session({ session, token }: { session: Session; token: JWT }) {
			if (token) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
