// app/chat/page.tsx
import { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useSession } from 'next-auth/react';

export default function ChatPage() {
	const { data: session } = useSession();
	const { messages, loading, fetchHistory, addMessage, sendMessage } =
		useChatStore();
	const [input, setInput] = useState('');
	const sessionId = 'session1'; // Static session ID for this example

	// Fetch conversation history when the component mounts
	useEffect(() => {
		if (session) fetchHistory(sessionId);
	}, [session, fetchHistory, sessionId]);

	const handleSend = async () => {
		addMessage('user', input);
		await sendMessage(sessionId, input);
		setInput('');
	};

	if (!session) {
		return <p>Please log in to access the chatbot.</p>;
	}

	return (
		<div>
			<h1>Gemini Chatbot</h1>
			<div
				style={{
					height: '300px',
					overflowY: 'scroll',
					border: '1px solid #ccc',
				}}
			>
				{messages.map((msg, index) => (
					<div
						key={index}
						style={{ textAlign: msg.sender === 'bot' ? 'left' : 'right' }}
					>
						<p>
							<strong>{msg.sender}</strong>: {msg.text}
						</p>
					</div>
				))}
			</div>
			<input
				type='text'
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder='Type a message...'
			/>
			<button onClick={handleSend} disabled={loading}>
				{loading ? 'Sending...' : 'Send'}
			</button>
		</div>
	);
}
