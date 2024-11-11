// app/login/page.tsx
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
		});

		if (result?.ok) {
			router.push('/chat');
		}
	};

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleLogin}>
				<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type='submit'>Login</button>
			</form>
		</div>
	);
}
