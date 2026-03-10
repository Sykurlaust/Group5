export type ChatParticipant = {
  name: string
  subtitle: string
  avatarFallback: string
}

export type ChatMessageItem = {
  id: string
  sender: "me" | "other"
  text: string
  timestamp: string
}

export type ChatConversation = {
  id: string
  listingTitle: string
  listingImage?: string
  participant: ChatParticipant
  lastMessage: string
  lastMessageAt: string
  unreadCount?: number
  messages: ChatMessageItem[]
}
