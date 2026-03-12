import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ChatWindow from "../components/chat/ChatWindow"
import ConversationList from "../components/chat/ConversationList"
import type { ChatConversation, ChatMessageItem } from "../components/chat/types"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import {
  markConversationAsRead,
  sendConversationMessage,
  subscribeConversationMessages,
  subscribeUserConversations,
} from "../lib/chat"

const MessagesPage = () => {
  const { firebaseUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const conversationFromQuery = searchParams.get("conversation")
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const [showConversationListOnMobile, setShowConversationListOnMobile] = useState(true)
  const [invalidConversationRequested, setInvalidConversationRequested] = useState(false)
  const [sendError, setSendError] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [conversationsError, setConversationsError] = useState("")
  const [realtimeReady, setRealtimeReady] = useState(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false
    }
    return window.navigator.onLine && document.visibilityState === "visible"
  })
  const hasInitializedUpdatesRef = useRef(false)
  const lastConversationActivityRef = useRef<Record<string, number>>({})

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return
    }

    const syncRealtimeReadiness = () => {
      setRealtimeReady(window.navigator.onLine && document.visibilityState === "visible")
    }

    syncRealtimeReadiness()
    window.addEventListener("online", syncRealtimeReadiness)
    window.addEventListener("offline", syncRealtimeReadiness)
    document.addEventListener("visibilitychange", syncRealtimeReadiness)

    return () => {
      window.removeEventListener("online", syncRealtimeReadiness)
      window.removeEventListener("offline", syncRealtimeReadiness)
      document.removeEventListener("visibilitychange", syncRealtimeReadiness)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)")
    const syncLayout = (event: MediaQueryList | MediaQueryListEvent) => {
      const isMobile = event.matches
      setIsMobileLayout(isMobile)
      if (!isMobile) {
        setShowConversationListOnMobile(true)
      } else if (!activeConversationId) {
        setShowConversationListOnMobile(true)
      }
    }

    syncLayout(mediaQuery)
    const listener = (event: MediaQueryListEvent) => syncLayout(event)
    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [activeConversationId])

  useEffect(() => {
    if (!firebaseUser || !realtimeReady) {
      setLoadingConversations(false)
      return
    }

    setLoadingConversations(true)
    setConversationsError("")

    const unsubscribe = subscribeUserConversations(
      firebaseUser.uid,
      (nextConversations) => {
        setConversations(nextConversations)
        setLoadingConversations(false)

        if (hasInitializedUpdatesRef.current) {
          for (const conversation of nextConversations) {
            const previous = lastConversationActivityRef.current[conversation.id] ?? 0
            const latest = conversation.lastMessageAt ?? 0
            const isIncoming = conversation.lastSenderId !== firebaseUser.uid
            if (conversation.unread && isIncoming && latest > previous) {
              playIncomingMessageTone()
              break
            }
          }
        } else {
          hasInitializedUpdatesRef.current = true
        }

        lastConversationActivityRef.current = Object.fromEntries(
          nextConversations.map((conversation) => [conversation.id, conversation.lastMessageAt ?? 0]),
        )
      },
      (error) => {
        console.error("Failed to subscribe conversations", error)
        setConversationsError("Could not load your conversations right now.")
        setLoadingConversations(false)
      },
    )

    return () => unsubscribe()
  }, [firebaseUser, realtimeReady])

  useEffect(() => {
    if (!conversations.length) {
      setActiveConversationId(null)
      setMessages([])
      setInvalidConversationRequested(Boolean(conversationFromQuery))
      return
    }

    if (conversationFromQuery) {
      const exists = conversations.some((conversation) => conversation.id === conversationFromQuery)
      if (exists) {
        setInvalidConversationRequested(false)
        setActiveConversationId(conversationFromQuery)
        if (isMobileLayout) {
          setShowConversationListOnMobile(false)
        }
      } else {
        setInvalidConversationRequested(true)
        setActiveConversationId(null)
        setMessages([])
      }
      return
    }

    setInvalidConversationRequested(false)
    setActiveConversationId((current) => {
      if (current && conversations.some((conversation) => conversation.id === current)) {
        return current
      }
      return conversations[0]?.id ?? null
    })
  }, [conversationFromQuery, conversations, isMobileLayout])

  useEffect(() => {
    if (!activeConversationId || !realtimeReady) {
      setMessages([])
      return
    }

    setLoadingMessages(true)
    setSendError("")

    const unsubscribe = subscribeConversationMessages(
      activeConversationId,
      (nextMessages) => {
        setMessages(nextMessages)
        setLoadingMessages(false)
      },
      (error) => {
        console.error("Failed to subscribe messages", error)
        setLoadingMessages(false)
        setSendError("Could not load messages for this conversation.")
      },
    )

    if (firebaseUser) {
      void markConversationAsRead(activeConversationId, firebaseUser.uid).catch((error) => {
        console.error("Failed to mark conversation as read", error)
      })
    }

    return () => unsubscribe()
  }, [activeConversationId, firebaseUser, realtimeReady])

  useEffect(() => {
    if (!activeConversationId || !conversationFromQuery) {
      return
    }
    if (conversationFromQuery === activeConversationId) {
      return
    }
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("conversation", activeConversationId)
    setSearchParams(nextParams, { replace: true })
  }, [activeConversationId, conversationFromQuery, searchParams, setSearchParams])

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    setInvalidConversationRequested(false)

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("conversation", conversationId)
    setSearchParams(nextParams, { replace: true })

    if (isMobileLayout) {
      setShowConversationListOnMobile(false)
    }
  }

  const handleSendMessage = async (messageValue: string) => {
    if (!firebaseUser || !activeConversation) {
      return
    }

    const recipientId =
      firebaseUser.uid === activeConversation.renterId
        ? activeConversation.landlordId
        : activeConversation.renterId

    if (!recipientId) {
      setSendError("This conversation is missing recipient data.")
      return
    }

    setSendError("")
    setIsSending(true)
    try {
      await sendConversationMessage({
        conversationId: activeConversation.id,
        senderId: firebaseUser.uid,
        recipientId,
        text: messageValue,
      })
      await markConversationAsRead(activeConversation.id, firebaseUser.uid)
    } catch (error) {
      console.error("Failed to send message", error)
      setSendError("Message failed to send. Please try again.")
    } finally {
      setIsSending(false)
    }
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
                currentUserId={firebaseUser?.uid ?? ""}
                invalidConversationRequested={invalidConversationRequested}
                isMobileView={isMobileLayout}
                loadingMessages={loadingMessages}
                messages={messages}
                onBackToList={() => setShowConversationListOnMobile(true)}
                onSendMessage={handleSendMessage}
                sendDisabled={!activeConversation || isSending}
                sendDisabledReason={sendError}
              />
            )}
          </div>
        </section>

        {(loadingConversations || conversationsError) && (
          <div className="mt-4 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
            {loadingConversations ? "Loading conversations..." : conversationsError}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

const playIncomingMessageTone = () => {
  if (typeof window === "undefined") {
    return
  }
  const AudioContextImpl = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextImpl) {
    return
  }

  const context = new AudioContextImpl()
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.type = "sine"
  oscillator.frequency.value = 840
  gainNode.gain.value = 0.02
  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + 0.08)
  oscillator.onended = () => {
    void context.close()
  }
}

export default MessagesPage
