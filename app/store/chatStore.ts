/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import axios from 'axios';

interface Message {
	sender: 'user' | 'bot';
	text: string;
}

interface ChatState {
	messages: Message[];
	loading: boolean;
	fetchHistory: (sessionId: string) => Promise<void>;
	addMessage: (sender: 'user' | 'bot', text: string) => void;
	sendMessage: (sessionId: string, message: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
	messages: [],
	loading: false,

	// Fetch message history for the session
	fetchHistory: async (sessionId) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/api/history?sessionId=${sessionId}`);
			const history = response.data.history
				.map((item: any) => [
					{ sender: 'user', text: item.message },
					{ sender: 'bot', text: item.response },
				])
				.flat();
			set({ messages: history });
		} catch (error) {
			console.error('Error fetching conversation history:', error);
		} finally {
			set({ loading: false });
		}
	},

	// Add a new message to the state
	addMessage: (sender, text) => {
		set((state) => ({
			messages: [...state.messages, { sender, text }],
		}));
	},

	// Send a message to the API and get a response
	sendMessage: async (sessionId, message) => {
		set((state) => ({
			messages: [...state.messages, { sender: 'user', text: message }],
			loading: true,
		}));
		try {
			const response = await axios.post('/api/chat', { sessionId, message });
			const botResponse = response.data.response;
			set((state) => ({
				messages: [...state.messages, { sender: 'bot', text: botResponse }],
			}));
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			set({ loading: false });
		}
	},
}));
