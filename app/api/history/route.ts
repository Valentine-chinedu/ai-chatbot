// app/api/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const sessionId = req.nextUrl.searchParams.get('sessionId') ?? '';

	try {
		const history = await prisma.conversation.findMany({
			where: {
				sessionId,
				userId: session.user?.id,
			},
			orderBy: { timestamp: 'asc' },
		});

		return NextResponse.json({ history });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Error fetching conversation history' },
			{ status: 500 }
		);
	}
}
