interface HeaderProps {
  agentMode: 'chat' | 'personal' | 'department'
  setAgentMode: (mode: 'chat' | 'personal' | 'department') => void
  setMode: (mode: string) => void
}

function Header({ agentMode, setAgentMode, setMode }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-[1800px] px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setMode('home')
                setAgentMode('personal')
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src="/AIA-Logo.png" alt="AIA" className="h-10 w-auto" />
              <div className="text-lg font-semibold text-gray-900">AIA Copilot</div>
            </button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <button
                onClick={() => {
                  setMode('home')
                  setAgentMode('chat')
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  agentMode === 'chat'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => {
                  setMode('home')
                  setAgentMode('personal')
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  agentMode === 'personal'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => {
                  setMode('home')
                  setAgentMode('department')
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  agentMode === 'department'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Department
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('builder')}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary-700 bg-primary-600"
            >
              <span>Recent Used Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

