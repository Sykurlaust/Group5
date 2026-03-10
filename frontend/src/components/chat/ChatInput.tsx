import { SendHorizonal } from "lucide-react"
import { useState } from "react"
import type { FormEvent } from "react"

type ChatInputProps = {
  disabled?: boolean
  onSend: (value: string) => void
}

const ChatInput = ({ disabled = false, onSend }: ChatInputProps) => {
  const [value, setValue] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextValue = value.trim()
    if (!nextValue || disabled) {
      return
    }
    onSend(nextValue)
    setValue("")
  }

  return (
    <div className="border-t border-black/5 bg-white px-4 py-4 sm:px-6">
      <form className="flex items-center gap-3" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-input">
          Write a message
        </label>
        <input
          className="flex-1 rounded-full border border-black/10 bg-[#f7f7f3] px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#047857]/15 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id="chat-input"
          onChange={(event) => setValue(event.target.value)}
          placeholder={disabled ? "Select a conversation first" : "Write a message..."}
          value={value}
        />
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#047857] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#036a4d] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || value.trim().length === 0}
          type="submit"
        >
          <SendHorizonal className="h-4 w-4" />
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatInput
