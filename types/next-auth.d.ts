// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { User } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			email: string;
			user: User
		};
	}
}
