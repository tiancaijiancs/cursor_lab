import { useState } from 'react'
import './LLMDemo.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function LLMDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await callOpenAI([...messages, userMessage])
      
      const assistantMessage: Message = { role: 'assistant', content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling LLM:', error)
      const errorMessage: Message = { 
        role: 'assistant', 
        content: error instanceof Error ? `Error: ${error.message}` : 'Sorry, I encountered an error. Please try again.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Call OpenAI API
  const callOpenAI = async (conversationHistory: Message[]): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.')
    }

    // Convert messages to OpenAI format
    const openAIMessages: OpenAIMessage[] = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openAIMessages,
        max_completion_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'No response generated'
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <div className="llm-demo">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation by typing a message below.</p>
            <p className="hint">Powered by OpenAI GPT-4o</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content">
                <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <strong>Assistant:</strong>
              <p className="loading">Thinking...</p>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          rows={3}
          disabled={isLoading}
          className="input-field"
        />
        <div className="button-group">
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="submit-button"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
          {messages.length > 0 && (
            <button 
              type="button" 
              onClick={clearMessages}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default LLMDemo

