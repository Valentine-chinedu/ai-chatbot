# AI Chatbot Application

A modern AI chatbot application built with Next.js and Gemini API, featuring authentication and real-time chat capabilities.

## Features

- 🔐 User Authentication
    - Email/Password login
    - Test user login functionality
    - Registration system
- 💬 Chat Interface
- 🎨 Modern UI with Tailwind CSS
- ⚡ Server-side rendering with Next.js
- 🔄 Real-time form validation

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Authentication**: Custom auth implementation
- **UI Components**: Custom components with shadcn/ui
- **Form Handling**: Server actions
- **Notifications**: Sonner toast

## Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

## Project Structure

```
chatbot/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── layout.tsx
├── components/
│   ├── auth-form.tsx
│   ├── submit-button.tsx
│   └── ui/
└── public/
```

## Contributing

Feel free to open issues and pull requests!

## License

MIT License
