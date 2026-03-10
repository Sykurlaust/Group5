import type { ChatMessageItem } from "./types"

type ChatMessageProps = {
  message: ChatMessageItem
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isOwnMessage = message.sender === "me"

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
          {message.timestamp}
        </p>
      </div>
    </div>
  )
}

export default ChatMessage
