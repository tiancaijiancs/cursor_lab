# LLM Demo - React

A simple React application demonstrating LLM integration with a chat interface.

## Features

- Clean, modern chat UI
- Message history display
- Loading states
- Responsive design
- TypeScript support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## API Configuration

The demo is configured to use OpenAI's GPT-3.5 Turbo API. The API key is stored in a `.env` file:

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your OpenAI API key to `.env`:
```
VITE_OPENAI_API_KEY=your-api-key-here
```

The `.env` file is already configured with your API key and is ignored by git for security.

### Changing the Model

You can modify the model in `src/components/LLMDemo.tsx` by changing the `model` parameter in the `callOpenAI` function:

```typescript
model: 'gpt-3.5-turbo',  // or 'gpt-4', 'gpt-4-turbo', etc.
```

### API Parameters

You can adjust the API parameters in the same function:
- `temperature`: Controls randomness (0.0 to 2.0, default: 0.7)
- `max_tokens`: Maximum tokens in response (default: 500)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS (no framework dependencies)

