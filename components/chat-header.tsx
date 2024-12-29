'use client';

import { useRouter } from 'next/navigation';

import { useWindowSize } from 'usehooks-ts';

// import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { BetterTooltip } from '@/components/ui/tooltip';

import { PlusIcon } from './icons';
import { useSidebar } from './ui/sidebar';

export function ChatHeader() {
    const router = useRouter();
    const { open } = useSidebar();

    const { width: windowWidth } = useWindowSize();

    return (
        <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
            <SidebarToggle />
            {(!open || windowWidth < 768) && (
                <BetterTooltip content="New Chat">
                    <Button
                        variant="outline"
                        className="order-2 ml-auto px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
                        onClick={() => {
                            router.push('/');
                            router.refresh();
                        }}
                    >
                        <PlusIcon />
                        <span className="md:sr-only">New Chat</span>
                    </Button>
                </BetterTooltip>
            )}

            <Button
                className="order-4 hidden h-fit bg-zinc-900 px-2 py-1.5 text-zinc-50 hover:bg-zinc-800 md:ml-auto md:flex md:h-[34px] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                asChild
            ></Button>
        </header>
    );
}
