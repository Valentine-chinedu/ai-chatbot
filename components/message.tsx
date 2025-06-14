'use client';

import { type Dispatch, type SetStateAction, memo } from 'react';

import type { Vote } from '@/lib/db/schema';
import type { Message } from 'ai';
import cx from 'classnames';
import equal from 'fast-deep-equal';
import { motion } from 'framer-motion';

import type { UIBlock } from './block';
import { DocumentToolCall, DocumentToolResult } from './document';
import { SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';

const PurePreviewMessage = ({
    chatId,
    message,
    block,
    setBlock,
    vote,
    isLoading,
}: {
    chatId: string;
    message: Message;
    block: UIBlock;
    setBlock: Dispatch<SetStateAction<UIBlock>>;
    vote: Vote | undefined;
    isLoading: boolean;
}) => {
    return (
        <motion.div
            className="group/message mx-auto w-full max-w-3xl px-4"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            data-role={message.role}
        >
            <div
                className={cx(
                    'group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2',
                )}
            >
                {message.role === 'assistant' && (
                    <div className="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
                        <SparklesIcon size={14} />
                    </div>
                )}

                <div className="flex w-full flex-col gap-2">
                    {message.content && (
                        <div className="flex flex-col gap-4">
                            <Markdown>{message?.content as string}</Markdown>
                        </div>
                    )}

                    {message.toolInvocations &&
                        message.toolInvocations.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {message.toolInvocations.map(
                                    (toolInvocation) => {
                                        const {
                                            toolName,
                                            toolCallId,
                                            state,
                                            args,
                                        } = toolInvocation;

                                        if (state === 'result') {
                                            const { result } = toolInvocation;

                                            return (
                                                <div key={toolCallId}>
                                                    {toolName ===
                                                    'getWeather' ? (
                                                        <Weather
                                                            weatherAtLocation={
                                                                result
                                                            }
                                                        />
                                                    ) : toolName ===
                                                      'createDocument' ? (
                                                        <DocumentToolResult
                                                            type="create"
                                                            result={result}
                                                            block={block}
                                                            setBlock={setBlock}
                                                        />
                                                    ) : toolName ===
                                                      'updateDocument' ? (
                                                        <DocumentToolResult
                                                            type="update"
                                                            result={result}
                                                            block={block}
                                                            setBlock={setBlock}
                                                        />
                                                    ) : toolName ===
                                                      'requestSuggestions' ? (
                                                        <DocumentToolResult
                                                            type="request-suggestions"
                                                            result={result}
                                                            block={block}
                                                            setBlock={setBlock}
                                                        />
                                                    ) : (
                                                        <pre>
                                                            {JSON.stringify(
                                                                result,
                                                                null,
                                                                2,
                                                            )}
                                                        </pre>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                key={toolCallId}
                                                className={cx({
                                                    skeleton: [
                                                        'getWeather',
                                                    ].includes(toolName),
                                                })}
                                            >
                                                {toolName === 'getWeather' ? (
                                                    <Weather />
                                                ) : toolName ===
                                                  'createDocument' ? (
                                                    <DocumentToolCall
                                                        type="create"
                                                        args={args}
                                                        setBlock={setBlock}
                                                    />
                                                ) : toolName ===
                                                  'updateDocument' ? (
                                                    <DocumentToolCall
                                                        type="update"
                                                        args={args}
                                                        setBlock={setBlock}
                                                    />
                                                ) : toolName ===
                                                  'requestSuggestions' ? (
                                                    <DocumentToolCall
                                                        type="request-suggestions"
                                                        args={args}
                                                        setBlock={setBlock}
                                                    />
                                                ) : null}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}

                    {message.experimental_attachments && (
                        <div className="flex flex-row gap-2">
                            {message.experimental_attachments.map(
                                (attachment) => (
                                    <PreviewAttachment
                                        key={attachment.url}
                                        attachment={attachment}
                                    />
                                ),
                            )}
                        </div>
                    )}

                    <MessageActions
                        key={`action-${message.id}`}
                        chatId={chatId}
                        message={message}
                        vote={vote}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export const PreviewMessage = memo(
    PurePreviewMessage,
    (prevProps, nextProps) => {
        if (prevProps.isLoading !== nextProps.isLoading) return false;
        if (prevProps.isLoading && nextProps.isLoading) return false;
        if (!equal(prevProps.vote, nextProps.vote)) return false;
        return true;
    },
);

export const ThinkingMessage = () => {
    const role = 'assistant';

    return (
        <motion.div
            className="group/message mx-auto w-full max-w-3xl px-4"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
            data-role={role}
        >
            <div
                className={cx(
                    'flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2',
                    {
                        'group-data-[role=user]/message:bg-muted': true,
                    },
                )}
            >
                <div className="ring-border flex size-8 shrink-0 items-center justify-center rounded-full ring-1">
                    <SparklesIcon size={14} />
                </div>

                <div className="flex w-full flex-col gap-2">
                    <div className="text-muted-foreground flex flex-col gap-4">
                        Thinking...
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
