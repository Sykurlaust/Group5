export type ChatMessageItem = {
  id: string
  senderId: string
  text: string
  createdAt: number | null
}

export type ChatConversation = {
  id: string
  listingId: string
  listingTitle: string
  listingImage: string
  renterId: string
  landlordId: string
  participantName: string
  participantSubtitle: string
  lastMessage: string
  lastMessageAt: number | null
  lastSenderId: string
  unreadBy: string[]
  unread: boolean
}
