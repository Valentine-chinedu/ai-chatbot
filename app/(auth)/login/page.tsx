'use client';

import { useActionState, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// import { set } from 'date-fns';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { type LoginActionState, login } from '../actions';

export default function Page() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const testerLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        setEmail('tester@gmail.com');
        setPassword('Young2sis#');

        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.requestSubmit();
            }
        }, 0);
    };

    const [state, formAction] = useActionState<LoginActionState, FormData>(
        login,
        {
            status: 'idle',
        },
    );

    useEffect(() => {
        if (state.status === 'failed') {
            toast.error('Invalid credentials!');
        } else if (state.status === 'invalid_data') {
            toast.error('Failed validating your submission!');
        } else if (state.status === 'success') {
            setIsSuccessful(true);
            router.refresh();
        }
    }, [state.status, router]);

    const handleSubmit = (formData: FormData) => {
        setEmail(formData.get('email') as string);
        formAction(formData);
    };

    return (
        <div className="flex h-dvh w-screen items-start justify-center bg-background pt-12 md:items-center md:pt-0">
            <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
                <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
                    <h3 className="text-xl font-semibold dark:text-zinc-50">
                        Sign In
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                        Use your email and password to sign in
                    </p>
                </div>
                <AuthForm
                    ref={formRef}
                    action={handleSubmit}
                    defaultEmail={email}
                    defaultPassword={password}
                >
                    <SubmitButton isSuccessful={isSuccessful}>
                        Sign in
                    </SubmitButton>
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
                        {"Don't have an account? "}
                        <Link
                            href="/register"
                            className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
                        >
                            Sign up
                        </Link>
                        {' for free or '}
                    </p>
                    <button
                        onClick={testerLogin}
                        className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
                    >
                        Test login
                    </button>
                </AuthForm>
            </div>
        </div>
    );
}
