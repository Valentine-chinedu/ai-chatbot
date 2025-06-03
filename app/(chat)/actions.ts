'use server';

import { google } from '@ai-sdk/google';
import { type CoreUserMessage, generateText } from 'ai';

export async function generateTitleFromUserMessage({
    message,
}: {
    message: CoreUserMessage;
}) {
    const model = google('gemini-2.5-flash-preview-05-20');
    if (!model) {
        throw new Error('Google Gemini model is not available');
    }
    const { text: title } = await generateText({
        model,
        system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
        prompt: JSON.stringify(message),
    });

    return title;
}
