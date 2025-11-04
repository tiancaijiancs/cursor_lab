import { useState } from 'react'
import Header from './components/Header'
import LeftSidebar from './components/LeftSidebar'
import ChatInterface from './components/ChatInterface'

function App() {
  const [agentMode, setAgentMode] = useState<'chat' | 'personal' | 'department'>('personal')
  const [mode, setMode] = useState('home')

  const handleNewChat = () => {
    // Handle new chat creation
    console.log('New chat')
  }

  const handleOpenChat = (id: string) => {
    // Handle opening existing chat
    console.log('Open chat:', id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header agentMode={agentMode} setAgentMode={setAgentMode} setMode={setMode} />
      <div className="mx-auto max-w-[1400px] px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[256px_1fr]">
          <LeftSidebar onNewChat={handleNewChat} onOpenChat={handleOpenChat} />
          <ChatInterface title={agentMode === 'chat' ? 'AIA copilot' : agentMode === 'personal' ? 'AIA copilot' : 'Department Assistant'} />
        </div>
      </div>
    </div>
  )
}

export default App

