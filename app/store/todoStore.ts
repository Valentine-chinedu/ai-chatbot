import { create } from 'zustand';

type Todo = {
	id: string;
	title: string;
	completed: boolean;
	date: string;
};

type TodoStore = {
	todos: Todo[];
	newTodo: string;
	date: string;
	setNewTodo: (newTodo: string) => void;
	setDate: (date: string) => void;
	fetchTodos: () => Promise<void>;
	addTodo: () => Promise<void>;
	toggleTodo: (id: string, completed: boolean) => Promise<void>;
	deleteTodo: (id: string) => Promise<void>;
};

export const useTodoStore = create<TodoStore>((set) => ({
	todos: [],
	newTodo: '',
	setNewTodo: (newTodo) => set({ newTodo }),

	fetchTodos: async () => {
		const res = await fetch('/api/todos');
		const data = await res.json();
		set({ todos: data });
	},

	addTodo: async () => {
		const state = useTodoStore.getState();
		if (!state.newTodo.trim()) return;

		await fetch('/api/todos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: state.newTodo }),
		});

		state.setNewTodo('');
		state.fetchTodos();
	},

	toggleTodo: async (id, completed) => {
		await fetch('/api/todos', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, completed: !completed }),
		});

		const state = useTodoStore.getState();
		state.fetchTodos();
	},

	deleteTodo: async (id) => {
		await fetch('/api/todos', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id }),
		});

		const state = useTodoStore.getState();
		state.fetchTodos();
	},
}));
