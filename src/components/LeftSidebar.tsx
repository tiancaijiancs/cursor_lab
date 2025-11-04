interface LeftSidebarProps {
  onNewChat?: () => void
  onOpenChat?: (id: string) => void
}

function LeftSidebar({ onNewChat, onOpenChat }: LeftSidebarProps) {
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-3 mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </div>
  )

  const Item = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-gray-50"
    >
      <span className="text-gray-800">{children}</span>
    </button>
  )

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:gap-3">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-soft">
        <div className="relative">
          <input
            placeholder="Search"
            className="w-full rounded-lg border-gray-200 bg-white pl-8 pr-3 py-1.5 text-sm shadow-soft focus:border-primary-300 focus:ring-primary-200"
          />
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            🔎
          </span>
        </div>
        <SectionTitle>Personal Agent</SectionTitle>
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 rounded-lg bg-primary-600 text-white text-sm py-2 px-3 mb-2 shadow-soft hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <span className="inline-block text-base">＋</span>
          <span>Create Personal Assistant</span>
        </button>
        <Item onClick={() => onOpenChat?.('custom-1')}>My Customize Assistant 1</Item>
        <Item onClick={() => onOpenChat?.('custom-2')}>My Customize Assistant 2</Item>
        <Item onClick={() => onOpenChat?.('custom-3')}>My Customize Assistant 3</Item>
        <SectionTitle>AI tools</SectionTitle>
        <Item onClick={() => onOpenChat?.('contract-review')}>
          Contract Review & Compliance Check
        </Item>
        <Item onClick={() => onOpenChat?.('data-summary')}>Data Summary Agent</Item>
        <Item onClick={() => onOpenChat?.('learning-research')}>
          Learning & Research Assistant
        </Item>
        <Item onClick={() => onOpenChat?.('multilingual-translation')}>
          Multilingual Translation Agent
        </Item>
        <Item onClick={() => onOpenChat?.('speech-script')}>Speech Script Generator</Item>
        <SectionTitle>History</SectionTitle>
        <Item onClick={() => onOpenChat?.('chat-1')}>Claim Review Request</Item>
        <Item onClick={() => onOpenChat?.('chat-2')}>Document Translation</Item>
        <Item onClick={() => onOpenChat?.('contract-review-q4')}>Q4 Contract Review</Item>
      </div>
    </div>
  )
}

export default LeftSidebar

