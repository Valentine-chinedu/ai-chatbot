import { Dispatch, SetStateAction, memo } from 'react';

import { Vote } from '@/lib/db/schema';
import { Message } from 'ai';

import { UIBlock } from './block';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';

interface MessagesProps {
    chatId: string;
    block: UIBlock;
    setBlock: Dispatch<SetStateAction<UIBlock>>;
    isLoading: boolean;
    votes: Array<Vote> | undefined;
    messages: Array<Message>;
}

function PureMessages({
    chatId,
    block,
    setBlock,
    isLoading,
    votes,
    messages,
}: MessagesProps) {
    const [messagesContainerRef, messagesEndRef] =
        useScrollToBottom<HTMLDivElement>();

    return (
        <div
            ref={messagesContainerRef}
            className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4"
        >
            {messages.map((message, index) => (
                <PreviewMessage
                    key={message.id}
                    chatId={chatId}
                    message={message}
                    block={block}
                    setBlock={setBlock}
                    isLoading={isLoading && messages.length - 1 === index}
                    vote={
                        votes
                            ? votes.find(
                                  (vote) => vote.messageId === message.id,
                              )
                            : undefined
                    }
                />
            ))}

            {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === 'user' && (
                    <ThinkingMessage />
                )}

            <div
                ref={messagesEndRef}
                className="min-h-[24px] min-w-[24px] shrink-0"
            />
        </div>
    );
}

function areEqual(prevProps: MessagesProps, nextProps: MessagesProps) {
    if (
        prevProps.block.status === 'streaming' &&
        nextProps.block.status === 'streaming'
    ) {
        return true;
    }

    return false;
}

export const Messages = memo(PureMessages, areEqual);
