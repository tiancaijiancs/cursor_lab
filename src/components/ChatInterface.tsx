import { useState, useRef, useEffect } from 'react'
import './ChatInterface.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatInterfaceProps {
  title?: string
}

function ChatInterface({ title = 'General Assistant' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<string | null>(null)
  const [file, setFile] = useState<{ name: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imageFile && !file) return

    // Add user message
    if (imageFile) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `[Image: ${imageFile}]` },
      ])
      setImageFile(null)
    }
    if (file) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `[File: ${file.name}]` },
      ])
      setFile(null)
    }
    if (input.trim()) {
      const userMessage: Message = { role: 'user', content: input }
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      try {
        const response = await callOpenAI([...messages, userMessage])
        const assistantMessage: Message = { role: 'assistant', content: response }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error('Error calling LLM:', error)
        const errorMessage: Message = {
          role: 'assistant',
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : 'Sorry, I encountered an error. Please try again.',
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const callOpenAI = async (conversationHistory: Message[]): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY

    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.')
    }

    const openAIMessages: OpenAIMessage[] = conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: openAIMessages,
          max_completion_tokens: 500,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API error: ${response.statusText} (${response.status})`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'No response generated'
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Failed to connect to OpenAI API. Please check your internet connection.')
      }
      throw error
    }
  }

  const Bubble = ({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) => (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-soft ${
        role === 'user'
          ? 'ml-auto bg-primary-600 text-white'
          : 'mr-auto bg-white border border-gray-200 text-gray-900'
      }`}
    >
      <div className="whitespace-pre-wrap">{children}</div>
    </div>
  )

  return (
    <div className="flex min-h-[70vh] flex-col rounded-2xl border border-gray-200 bg-gray-50 shadow-soft">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 rounded-t-2xl">
                  <div className="text-sm font-semibold text-gray-900">
                    {title === 'General Assistant' ? 'AIA copilot' : title}
                  </div>
        <div className="flex items-center gap-2"></div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center select-none">
            <div className="mb-7 flex items-center justify-center h-20 w-20 rounded-2xl bg-primary-50 p-2 shadow-soft">
              <img src="/AIAnew.jpg" alt="AIA" className="h-full w-auto object-contain" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">AIA copilot</div>
            <div className="mb-4 text-base text-gray-600 max-w-md">
              Ask me anything. I'm your AIA copilot and I can guide you through AIA Copilot.
              <br />
              Start a conversation below.
            </div>
            <div className="mt-2 text-xs text-gray-400">All your chats and agents are private unless shared.</div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            {messages.map((m, idx) => (
              <Bubble key={idx} role={m.role}>
                {m.content}
              </Bubble>
            ))}
            {isLoading && (
              <Bubble role="assistant">Thinking...</Bubble>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 bg-white p-3 rounded-b-2xl">
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder={`Message ${title}...`}
            className="max-h-40 flex-1 resize-none rounded-lg border-gray-200 bg-white px-3 py-2 text-sm shadow-soft focus:border-primary-300 focus:ring-primary-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            disabled={isLoading}
          />
          <label className="cursor-pointer rounded-lg bg-white border border-gray-200 p-2 hover:bg-primary-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const url = URL.createObjectURL(f)
                setImageFile(url)
                e.target.value = ''
              }}
            />
            <span className="text-lg">🖼️</span>
          </label>
          <label className="cursor-pointer rounded-lg bg-white border border-gray-200 p-2 hover:bg-primary-50">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                setFile({ name: f.name })
                e.target.value = ''
              }}
            />
            <span className="text-lg">📎</span>
          </label>
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !imageFile && !file)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        {(imageFile || file) && (
          <div className="mx-auto w-full max-w-3xl text-[13px] mt-2 flex gap-4 flex-wrap items-center">
            {imageFile && (
              <div className="flex items-center gap-2 border border-primary-100 bg-primary-50 px-3 py-1.5 rounded-lg">
                <img
                  src={imageFile}
                  alt="preview"
                  className="h-8 w-8 object-cover rounded border border-gray-300"
                />
                <span className="truncate max-w-[120px] text-gray-700">Image</span>
                <button
                  onClick={() => setImageFile(null)}
                  className="ml-1 text-sm text-primary-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            {file && (
              <div className="flex items-center gap-2 border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-lg">
                <span className="text-[18px]">📎</span>
                <span className="truncate max-w-[120px] text-gray-700">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="ml-1 text-sm text-primary-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
        <div className="mx-auto w-full max-w-3xl text-[11px] text-gray-500 mt-2">
          Powered by OpenAI GPT-4o
        </div>
      </div>
    </div>
  )
}

export default ChatInterface

