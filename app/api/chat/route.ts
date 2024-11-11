// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	const userId = session.user?.id;

	if (!userId) {
		return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
	}

	const { sessionId, message } = await req.json();

	try {
		const geminiResponse = await axios.post(
			'https://api.gemini.com/v1/chat',
			{ message },
			{ headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
		);

		const responseText = geminiResponse.data.reply;

		await prisma.conversation.create({
			data: {
				sessionId,
				message,
				response: responseText,
				userId,
			},
		});

		return NextResponse.json({ response: responseText });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Something went wrong' },
			{ status: 500 }
		);
	}
}
