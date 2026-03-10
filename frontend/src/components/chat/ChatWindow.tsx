import { ArrowLeft, MessageCircle } from "lucide-react"
import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"
import type { ChatConversation } from "./types"

type ChatWindowProps = {
  activeConversation: ChatConversation | null
  isMobileView: boolean
  onBackToList: () => void
  onSendMessage: (value: string) => void
}

const ChatWindow = ({
  activeConversation,
  isMobileView,
  onBackToList,
  onSendMessage,
}: ChatWindowProps) => {
  if (!activeConversation) {
    return (
      <section className="flex h-full flex-col items-center justify-center bg-[#fafaf7] px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#047857]/10 text-[#047857]">
          <MessageCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Select a conversation</h2>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Choose a conversation from the left to start chatting.
        </p>
      </section>
    )
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex items-center gap-4 border-b border-black/5 bg-white px-5 py-4">
        {isMobileView && (
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-gray-600 transition hover:bg-black/5"
            onClick={onBackToList}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {activeConversation.listingImage ? (
          <img
            alt={activeConversation.listingTitle}
            className="h-12 w-12 rounded-2xl object-cover"
            src={activeConversation.listingImage}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#047857]/10 text-sm font-semibold text-[#047857]">
            {activeConversation.participant.avatarFallback}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="line-clamp-1 text-base font-semibold text-gray-900">
            {activeConversation.listingTitle}
          </h2>
          <p className="line-clamp-1 text-sm text-gray-500">
            {activeConversation.participant.name} · Rental inquiry
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-[#fafaf7] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4">
          {activeConversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      <ChatInput onSend={onSendMessage} />
    </section>
  )
}

export default ChatWindow
