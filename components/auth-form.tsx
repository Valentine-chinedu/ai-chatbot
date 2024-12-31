import { forwardRef } from 'react';

import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export const AuthForm = forwardRef<
    HTMLFormElement,
    {
        action: NonNullable<
            string | ((formData: FormData) => void | Promise<void>) | undefined
        >;
        children: React.ReactNode;
        defaultEmail?: string;
        defaultPassword?: string;
    }
>(function AuthForm(
    { action, children, defaultEmail = '', defaultPassword = '' },
    ref,
) {
    return (
        <Form
            ref={ref}
            action={action}
            className="flex flex-col gap-4 px-4 sm:px-16"
        >
            <div className="flex flex-col gap-2">
                <Label
                    htmlFor="email"
                    className="font-normal text-zinc-600 dark:text-zinc-400"
                >
                    Email Address
                </Label>

                <Input
                    id="email"
                    name="email"
                    className="bg-muted text-md md:text-sm"
                    type="email"
                    placeholder="user@acme.com"
                    autoComplete="email"
                    required
                    autoFocus
                    defaultValue={defaultEmail}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label
                    htmlFor="password"
                    className="font-normal text-zinc-600 dark:text-zinc-400"
                >
                    Password
                </Label>

                <Input
                    id="password"
                    name="password"
                    className="bg-muted text-md md:text-sm"
                    type="password"
                    required
                    defaultValue={defaultPassword}
                />
            </div>

            {children}
        </Form>
    );
});
