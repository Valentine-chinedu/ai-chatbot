'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { User } from 'next-auth';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    useSidebar,
} from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/ui/tooltip';

export function AppSidebar({ user }: { user: User | undefined }) {
    const router = useRouter();
    const { setOpenMobile } = useSidebar();

    return (
        <Sidebar className="bg-gray-100 group-data-[side=left]:border-r-0">
            <SidebarHeader>
                <SidebarMenu>
                    <div className="flex flex-row items-center justify-between">
                        <Link
                            href="/"
                            onClick={() => {
                                setOpenMobile(false);
                            }}
                            className="flex flex-row items-center gap-3"
                        >
                            <span className="hover:bg-muted cursor-pointer rounded-md px-2 text-lg font-semibold">
                                Gemini Chatbot
                            </span>
                        </Link>
                        <BetterTooltip content="New Chat" align="start">
                            <Button
                                variant="ghost"
                                type="button"
                                className="h-fit p-2"
                                onClick={() => {
                                    setOpenMobile(false);
                                    router.push('/');
                                    router.refresh();
                                }}
                            >
                                <PlusIcon />
                            </Button>
                        </BetterTooltip>
                    </div>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="-mx-2">
                    <SidebarHistory user={user} />
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="-mx-2 gap-0">
                {user && (
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarUserNav user={user} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
