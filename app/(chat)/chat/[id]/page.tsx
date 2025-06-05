// import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertToUIMessages } from '@/lib/utils';

import { Chat } from '@/components/chat';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const chat = await getChatById({ id });

    if (!chat) {
        notFound();
    }

    const session = await auth();

    if (!session || !session.user) {
        return notFound();
    }

    if (session.user.id !== chat.userId) {
        return notFound();
    }

    const messagesFromDb = await getMessagesByChatId({
        id,
    });
    if (!messagesFromDb) {
        notFound();
    }
    return (
        <Chat
            id={chat?.id}
            initialMessages={convertToUIMessages(messagesFromDb)}
        />
    );
}
