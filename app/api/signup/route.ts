import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
	const { email, password } = await request.json();

	// Check if user already exists
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		return NextResponse.json({ error: 'User already exists' }, { status: 400 });
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create new user
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
		},
	});

	return NextResponse.json({ user });
}
