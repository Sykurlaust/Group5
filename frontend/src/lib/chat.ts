import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getCountFromServer,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "./firebase"

export type ConversationSummary = {
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

export type ConversationMessage = {
  id: string
  senderId: string
  text: string
  createdAt: number | null
}

type CreateOrGetConversationInput = {
  listingId: string
  listingTitle: string
  listingImage?: string
  renterId: string
  landlordId: string
  renterName?: string
  landlordName?: string
}

type SendMessageInput = {
  conversationId: string
  senderId: string
  recipientId: string
  text: string
}

export const buildConversationId = (listingId: string, renterId: string, landlordId: string) => {
  return `${sanitizeForDocId(listingId)}_${sanitizeForDocId(renterId)}_${sanitizeForDocId(landlordId)}`
}

export const createOrGetConversation = async ({
  listingId,
  listingTitle,
  listingImage = "",
  renterId,
  landlordId,
  renterName = "",
  landlordName = "",
}: CreateOrGetConversationInput): Promise<string> => {
  const conversationId = buildConversationId(listingId, renterId, landlordId)
  const conversationRef = doc(db, "conversations", conversationId)
  const existing = await getDoc(conversationRef)

  if (!existing.exists()) {
    await setDoc(conversationRef, {
      conversationId,
      listingId,
      listingTitle,
      listingImage,
      renterId,
      landlordId,
      renterName,
      landlordName,
      participants: [renterId, landlordId],
      unreadBy: [],
      lastMessage: "",
      lastMessageAt: null,
      lastSenderId: "",
      createdAt: serverTimestamp(),
    })
    return conversationId
  }

  await setDoc(
    conversationRef,
    {
      listingTitle,
      listingImage,
      renterName: renterName || existing.data().renterName || "",
      landlordName: landlordName || existing.data().landlordName || "",
      participants: [renterId, landlordId],
    },
    { merge: true },
  )

  return conversationId
}

export const subscribeUserConversations = (
  userId: string,
  onData: (conversations: ConversationSummary[]) => void,
  onError?: (error: Error) => void,
) => {
  const conversationsQuery = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
  )

  return onSnapshot(
    conversationsQuery,
    (snapshot) => {
      const conversations = snapshot.docs
        .map((docSnap) => mapConversationSummary(docSnap, userId))
        .sort((a, b) => (b.lastMessageAt ?? 0) - (a.lastMessageAt ?? 0))
      onData(conversations)
    },
    (error) => onError?.(error),
  )
}

export const subscribeUnreadConversationCount = (
  userId: string,
  onData: (count: number) => void,
  onError?: (error: Error) => void,
) => {
  const unreadQuery = query(collection(db, "conversations"), where("unreadBy", "array-contains", userId))
  return onSnapshot(
    unreadQuery,
    (snapshot) => onData(snapshot.size),
    (error) => onError?.(error),
  )
}

export const fetchUnreadConversationCount = async (userId: string): Promise<number> => {
  const unreadQuery = query(collection(db, "conversations"), where("unreadBy", "array-contains", userId))
  const aggregateSnapshot = await getCountFromServer(unreadQuery)
  return aggregateSnapshot.data().count
}

export const subscribeConversationMessages = (
  conversationId: string,
  onData: (messages: ConversationMessage[]) => void,
  onError?: (error: Error) => void,
) => {
  const messagesQuery = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc"),
  )

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs.map(mapConversationMessage)
      onData(messages)
    },
    (error) => onError?.(error),
  )
}

export const sendConversationMessage = async ({
  conversationId,
  senderId,
  recipientId,
  text,
}: SendMessageInput) => {
  const value = text.trim()
  if (!value) {
    return
  }

  const conversationRef = doc(db, "conversations", conversationId)
  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    senderId,
    text: value,
    createdAt: serverTimestamp(),
  })

  if (recipientId && recipientId !== senderId) {
    await updateDoc(conversationRef, {
      lastMessage: value,
      lastMessageAt: serverTimestamp(),
      lastSenderId: senderId,
      unreadBy: arrayUnion(recipientId),
    })
    await updateDoc(conversationRef, {
      unreadBy: arrayRemove(senderId),
    })
    return
  }

  await updateDoc(conversationRef, {
    lastMessage: value,
    lastMessageAt: serverTimestamp(),
    lastSenderId: senderId,
    unreadBy: arrayRemove(senderId),
  })
}

export const markConversationAsRead = async (conversationId: string, userId: string) => {
  if (!conversationId || !userId) {
    return
  }
  await updateDoc(doc(db, "conversations", conversationId), {
    unreadBy: arrayRemove(userId),
  })
}

const mapConversationSummary = (
  snapshot: QueryDocumentSnapshot<DocumentData>,
  currentUserId: string,
): ConversationSummary => {
  const data = snapshot.data()
  const renterId = readString(data.renterId)
  const landlordId = readString(data.landlordId)
  const unreadBy = Array.isArray(data.unreadBy)
    ? data.unreadBy.filter((value): value is string => typeof value === "string")
    : []
  const isCurrentUserRenter = renterId === currentUserId
  const fallbackParticipantName = isCurrentUserRenter ? "Landlord" : "Renter"

  return {
    id: snapshot.id,
    listingId: readString(data.listingId),
    listingTitle: readString(data.listingTitle) || "Untitled listing",
    listingImage: readString(data.listingImage),
    renterId,
    landlordId,
    participantName:
      (isCurrentUserRenter ? readString(data.landlordName) : readString(data.renterName)) ||
      fallbackParticipantName,
    participantSubtitle: isCurrentUserRenter ? "Landlord" : "Renter",
    lastMessage: readString(data.lastMessage),
    lastMessageAt: toMillis(data.lastMessageAt),
    lastSenderId: readString(data.lastSenderId),
    unreadBy,
    unread: unreadBy.includes(currentUserId),
  }
}

const mapConversationMessage = (snapshot: QueryDocumentSnapshot<DocumentData>): ConversationMessage => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    senderId: readString(data.senderId),
    text: readString(data.text),
    createdAt: toMillis(data.createdAt),
  }
}

const toMillis = (value: unknown): number | null => {
  if (!value || typeof value !== "object") {
    return null
  }

  if ("toMillis" in value && typeof (value as { toMillis: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis()
  }

  return null
}

const readString = (value: unknown): string => (typeof value === "string" ? value : "")

const sanitizeForDocId = (value: string) => value.replace(/[/.#$[\]]/g, "_")
