import { read, write, makeId, subscribe as subscribeStorage, KEYS } from "../utils/storage"
import { getAd } from "./adService"
import { getUsers } from "./userService"

// Suhbat: bitta e'lon bo'yicha bitta mijoz bilan e'lon egasi o'rtasida.
// { id, adId, adTitle, clientId, mediaId, messages: [{ id, senderId, text, createdAt }], reads: { [userId]: ms }, createdAt, updatedAt }

function allChats() {
  return read(KEYS.chats, [])
}

function isParticipant(chat, userId) {
  return chat.clientId === userId || chat.mediaId === userId
}

function describe(chat, userId) {
  const names = new Map(getUsers().map((u) => [u.id, u.name]))
  const otherId = chat.clientId === userId ? chat.mediaId : chat.clientId
  const last = chat.messages[chat.messages.length - 1] || null
  const readAt = chat.reads?.[userId] || 0
  const unread = chat.messages.filter((m) => m.senderId !== userId && m.createdAt > readAt).length
  return {
    ...chat,
    otherId,
    otherName: names.get(otherId) || "Foydalanuvchi",
    adExists: Boolean(getAd(chat.adId)),
    last,
    unread,
  }
}

export function startConversation({ adId, userId }) {
  const ad = getAd(adId)
  if (!ad) throw new Error("E'lon topilmadi.")
  if (ad.userId === userId) throw new Error("O'zingizning e'loningizga yozib bo'lmaydi.")

  const chats = allChats()
  const existing = chats.find((c) => c.adId === adId && c.clientId === userId)
  if (existing) return existing.id

  const now = Date.now()
  const chat = {
    id: makeId(),
    adId,
    adTitle: ad.title,
    clientId: userId,
    mediaId: ad.userId,
    messages: [],
    reads: { [userId]: now },
    createdAt: now,
    updatedAt: now,
  }
  write(KEYS.chats, [chat, ...chats])
  return chat.id
}

export function listConversations(userId) {
  return allChats()
    .filter((c) => isParticipant(c, userId))
    .map((c) => describe(c, userId))
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getConversation(id, userId) {
  const chat = allChats().find((c) => c.id === id)
  if (!chat || !isParticipant(chat, userId)) return null
  return describe(chat, userId)
}

export function sendMessage(chatId, userId, text) {
  const body = String(text ?? "").trim()
  if (!body) throw new Error("Xabar bo'sh bo'lmasligi kerak.")
  if (body.length > 2000) throw new Error("Xabar 2000 ta belgidan oshmasligi kerak.")

  const chats = allChats()
  const index = chats.findIndex((c) => c.id === chatId)
  if (index === -1 || !isParticipant(chats[index], userId)) throw new Error("Suhbat topilmadi.")

  const now = Date.now()
  const message = { id: makeId(), senderId: userId, text: body, createdAt: now }
  chats[index] = {
    ...chats[index],
    messages: [...chats[index].messages, message],
    reads: { ...chats[index].reads, [userId]: now },
    updatedAt: now,
  }
  write(KEYS.chats, chats)
  return message
}

export function markRead(chatId, userId) {
  const chats = allChats()
  const index = chats.findIndex((c) => c.id === chatId)
  if (index === -1 || !isParticipant(chats[index], userId)) return
  const chat = chats[index]
  const hasUnread = chat.messages.some((m) => m.senderId !== userId && m.createdAt > (chat.reads?.[userId] || 0))
  if (!hasUnread) return
  chats[index] = { ...chat, reads: { ...chat.reads, [userId]: Date.now() } }
  write(KEYS.chats, chats)
}

export function unreadCount(userId) {
  if (!userId) return 0
  return listConversations(userId).reduce((sum, c) => sum + c.unread, 0)
}

export function subscribe(callback) {
  return subscribeStorage([KEYS.chats, KEYS.users, KEYS.ads], callback)
}
