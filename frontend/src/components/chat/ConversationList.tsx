import { MessageSquare } from "lucide-react"
import type { ChatConversation } from "./types"

type ConversationListProps = {
  conversations: ChatConversation[]
  activeConversationId: string | null
  onSelectConversation: (conversationId: string) => void
}

const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  return (
    <aside className="flex h-full flex-col border-r border-black/5 bg-[#fcfcfa]">
      <div className="border-b border-black/5 px-5 py-5">
        <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">Your conversations</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 px-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#047857]/10 text-[#047857]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-gray-900">No conversations yet</p>
            <p className="mt-1 text-sm text-gray-500">
              When a renter contacts a landlord, the chat will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {conversations.map((conversation) => {
              const isActive = activeConversationId === conversation.id
              return (
                <li key={conversation.id}>
                  <button
                    className={`group flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                      isActive
                        ? "bg-[#eef7f2] ring-1 ring-[#047857]/10"
                        : "hover:bg-black/5 hover:translate-x-[1px]"
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                    type="button"
                  >
                    {conversation.listingImage ? (
                      <img
                        alt={conversation.listingTitle}
                        className="h-12 w-12 rounded-2xl object-cover"
                        src={conversation.listingImage}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#047857]/10 text-sm font-semibold text-[#047857]">
                        {conversation.participant.avatarFallback}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                          {conversation.listingTitle}
                        </p>
                        <p className="shrink-0 text-xs text-gray-400">{conversation.lastMessageAt}</p>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">{conversation.lastMessage}</p>
                    </div>

                    {Boolean(conversation.unreadCount) && (
                      <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#047857]" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}

export default ConversationList
