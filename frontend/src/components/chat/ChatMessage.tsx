import type { ChatMessageItem } from "./types"

type ChatMessageProps = {
  message: ChatMessageItem
  currentUserId: string
}

const ChatMessage = ({ message, currentUserId }: ChatMessageProps) => {
  const isOwnMessage = message.senderId === currentUserId
  const timestamp = formatMessageTime(message.createdAt)

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[75%]">
        <p
          className={
            isOwnMessage
              ? "ml-auto rounded-[24px] rounded-br-md bg-[#3f37f0] px-4 py-3 text-sm text-white shadow-sm"
              : "mr-auto rounded-[24px] rounded-bl-md border border-black/5 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm"
          }
        >
          {message.text}
        </p>
        <p className={`mt-1 text-[11px] text-gray-400 ${isOwnMessage ? "text-right" : "text-left"}`}>
          {timestamp}
        </p>
      </div>
    </div>
  )
}

const formatMessageTime = (value: number | null) => {
  if (!value) {
    return "Now"
  }
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export default ChatMessage
