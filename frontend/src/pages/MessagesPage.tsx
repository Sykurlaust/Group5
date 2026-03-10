import { useEffect, useMemo, useState } from "react"
import ChatWindow from "../components/chat/ChatWindow"
import ConversationList from "../components/chat/ConversationList"
import type { ChatConversation } from "../components/chat/types"
import Footer from "../components/Footer"
import Header from "../components/Header"
import sampleImage from "../assets/reiseuhu-W_7-oQmwyuw-unsplash.jpg"

const initialConversations: ChatConversation[] = [
  {
    id: "conv-1",
    listingTitle: "Flat / apartment in Las Palmas",
    listingImage: sampleImage,
    participant: {
      name: "Marina López",
      subtitle: "Landlord",
      avatarFallback: "ML",
    },
    lastMessage: "Great, I can offer a viewing this Thursday at 18:00.",
    lastMessageAt: "2m",
    unreadCount: 1,
    messages: [
      { id: "m-1", sender: "other", text: "Hi Diogo, thanks for your interest in the apartment.", timestamp: "10:14" },
      { id: "m-2", sender: "me", text: "Thanks Marina. Is it still available from next month?", timestamp: "10:18" },
      { id: "m-3", sender: "other", text: "Yes, availability starts on the 1st.", timestamp: "10:20" },
      { id: "m-4", sender: "me", text: "Perfect. Could we arrange a viewing this week?", timestamp: "10:21" },
      { id: "m-5", sender: "other", text: "Great, I can offer a viewing this Thursday at 18:00.", timestamp: "10:22" },
    ],
  },
  {
    id: "conv-2",
    listingTitle: "Apartment near Maspalomas dunes",
    participant: {
      name: "Carlos Medina",
      subtitle: "Landlord",
      avatarFallback: "CM",
    },
    lastMessage: "Please send your preferred move-in date.",
    lastMessageAt: "1h",
    messages: [
      { id: "m-6", sender: "other", text: "Hello! I saw your request for the Maspalomas apartment.", timestamp: "09:02" },
      { id: "m-7", sender: "me", text: "Hi Carlos, yes. I’m looking for long-term from summer.", timestamp: "09:10" },
      { id: "m-8", sender: "other", text: "Please send your preferred move-in date.", timestamp: "09:12" },
    ],
  },
  {
    id: "conv-3",
    listingTitle: "City center one-bedroom in Telde",
    participant: {
      name: "Elena Cruz",
      subtitle: "Landlord",
      avatarFallback: "EC",
    },
    lastMessage: "The contract can be 12 months minimum.",
    lastMessageAt: "Yesterday",
    messages: [
      { id: "m-9", sender: "me", text: "Hi Elena, can you confirm the minimum contract length?", timestamp: "Yesterday" },
      { id: "m-10", sender: "other", text: "The contract can be 12 months minimum.", timestamp: "Yesterday" },
    ],
  },
]

const MessagesPage = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  )
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const [showConversationListOnMobile, setShowConversationListOnMobile] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)")
    const syncLayout = (event: MediaQueryList | MediaQueryListEvent) => {
      const isMobile = event.matches
      setIsMobileLayout(isMobile)
      setShowConversationListOnMobile(isMobile ? activeConversationId === null : true)
    }

    syncLayout(mediaQuery)
    const listener = (event: MediaQueryListEvent) => syncLayout(event)
    mediaQuery.addEventListener("change", listener)

    return () => {
      mediaQuery.removeEventListener("change", listener)
    }
  }, [activeConversationId])

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    if (isMobileLayout) {
      setShowConversationListOnMobile(false)
    }
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
      ),
    )
  }

  const handleSendMessage = (messageValue: string) => {
    if (!activeConversationId) {
      return
    }

    const nextMessage = {
      id: `m-${Date.now()}`,
      sender: "me" as const,
      text: messageValue,
      timestamp: "Now",
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              lastMessage: messageValue,
              lastMessageAt: "Now",
              messages: [...conversation.messages, nextMessage],
            }
          : conversation,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f3] font-['Space_Grotesk'] text-[#1f1f1f]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="h-[calc(100vh-170px)] overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
            {(!isMobileLayout || showConversationListOnMobile) && (
              <ConversationList
                activeConversationId={activeConversationId}
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
              />
            )}

            {(!isMobileLayout || !showConversationListOnMobile) && (
              <ChatWindow
                activeConversation={activeConversation}
                isMobileView={isMobileLayout}
                onBackToList={() => setShowConversationListOnMobile(true)}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default MessagesPage
