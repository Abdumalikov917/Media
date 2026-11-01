// Hozircha barcha ma'lumotlar brauzerning localStorage'ida saqlanadi.
// Bu degani: ma'lumotlar faqat shu qurilma va shu brauzerda ko'rinadi.
// Haqiqiy sayt uchun servislarni (src/services) server bilan almashtirish kerak.

export const KEYS = {
  users: "media_users",
  session: "media_session",
  ads: "media_ads",
  chats: "media_chats",
  viewed: "media_viewed",
}

const CHANGE_EVENT = "media:storage"
const hasWindow = typeof window !== "undefined"

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error("Ma'lumotni saqlab bo'lmadi. Brauzer xotirasi to'lgan yoki o'chirilgan.")
  }
  if (hasWindow) window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }))
}

export function remove(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* e'tiborsiz */
  }
  if (hasWindow) window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }))
}

export function readSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* e'tiborsiz */
  }
}

/** Berilgan kalitlar o'zgarganda (shu tabda yoki boshqa tabda) callback chaqiriladi. */
export function subscribe(keys, callback) {
  if (!hasWindow) return () => {}
  const watched = new Set(keys)
  const onStorage = (e) => {
    if (e.key === null || watched.has(e.key)) callback()
  }
  const onChange = (e) => {
    if (watched.has(e.detail?.key)) callback()
  }
  window.addEventListener("storage", onStorage)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
