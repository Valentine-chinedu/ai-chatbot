// ClientSessionProvider.tsx
'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

export interface AuthContextprops {
	children: React.ReactNode;
	session: Session;
}

const ClientSessionProvider = ({ children, session }: AuthContextprops) => (
	<SessionProvider session={session}>{children}</SessionProvider>
);

export default ClientSessionProvider;
