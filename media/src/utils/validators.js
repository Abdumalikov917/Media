import { CATEGORIES } from "../data/categories"

export class ValidationError extends Error {
  constructor(message, fields = {}) {
    super(message)
    this.name = "ValidationError"
    this.fields = fields
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(name) {
  const v = String(name ?? "").trim()
  if (v.length < 2) return "Ismingizni kiriting (kamida 2 ta belgi)."
  if (v.length > 60) return "Ism 60 ta belgidan oshmasligi kerak."
  return ""
}

export function validateEmail(email) {
  const v = String(email ?? "").trim()
  if (!v) return "Email manzilini kiriting."
  if (!EMAIL_RE.test(v)) return "Email manzili noto'g'ri. Masalan: ism@gmail.com"
  return ""
}

export function validatePassword(password) {
  const v = String(password ?? "")
  if (v.length < 6) return "Parol kamida 6 ta belgidan iborat bo'lsin."
  if (v.length > 100) return "Parol 100 ta belgidan oshmasligi kerak."
  return ""
}

/**
 * Telefon raqamini +998901234567 ko'rinishiga keltiradi.
 * Bo'sh bo'lsa "" qaytaradi, noto'g'ri bo'lsa null.
 */
export function normalizePhone(value) {
  const raw = String(value ?? "").trim()
  if (!raw) return ""
  const hasPlus = raw.startsWith("+")
  const digits = raw.replace(/\D/g, "")
  if (!digits) return null
  if (!hasPlus && digits.length === 9) return `+998${digits}`
  if (!hasPlus && digits.length === 12 && digits.startsWith("998")) return `+${digits}`
  if (hasPlus && digits.length >= 10 && digits.length <= 15) return `+${digits}`
  return null
}

function cleanHandle(value) {
  let v = String(value ?? "").trim()
  v = v.replace(/^https?:\/\/(www\.)?(instagram\.com|t\.me|telegram\.me)\//i, "")
  v = v.replace(/^@/, "")
  v = v.replace(/[/?#].*$/, "")
  return v
}

/** Instagram username: "" (bo'sh), null (noto'g'ri) yoki tozalangan username. */
export function normalizeInstagram(value) {
  const v = cleanHandle(value)
  if (!v) return ""
  return /^[A-Za-z0-9._]{1,30}$/.test(v) ? v : null
}

/** Telegram username: "" (bo'sh), null (noto'g'ri) yoki tozalangan username. */
export function normalizeTelegram(value) {
  const v = cleanHandle(value)
  if (!v) return ""
  return /^[A-Za-z0-9_]{5,32}$/.test(v) ? v : null
}

/** Telefon, Instagram yoki Telegram'dan kamida bittasi to'ldirilishi shart. */
export function validateContacts({ phone, instagram, telegram }) {
  const errors = {}
  const values = { phone: "", instagram: "", telegram: "" }

  const p = normalizePhone(phone)
  if (p === null) errors.phone = "Telefon raqami noto'g'ri. Masalan: +998 90 123 45 67"
  else values.phone = p

  const i = normalizeInstagram(instagram)
  if (i === null) errors.instagram = "Instagram username noto'g'ri. Faqat harf, raqam, nuqta va pastki chiziq."
  else values.instagram = i

  const t = normalizeTelegram(telegram)
  if (t === null) errors.telegram = "Telegram username noto'g'ri (kamida 5 ta belgi: harf, raqam, pastki chiziq)."
  else values.telegram = t

  const anyFilled = values.phone || values.instagram || values.telegram
  if (!anyFilled && !errors.phone && !errors.instagram && !errors.telegram) {
    errors.contacts = "Telefon, Instagram yoki Telegram'dan kamida bittasini to'ldiring."
  }

  return { ok: Object.keys(errors).length === 0, errors, values }
}

export function validateAd({ title, category, description, phone, instagram, telegram }) {
  const errors = {}

  const t = String(title ?? "").trim()
  if (t.length < 5) errors.title = "Sarlavha kamida 5 ta belgidan iborat bo'lsin."
  else if (t.length > 80) errors.title = "Sarlavha 80 ta belgidan oshmasligi kerak."

  if (!CATEGORIES.some((c) => c.id === category)) errors.category = "Kategoriyani tanlang."

  const d = String(description ?? "").trim()
  if (d.length < 20) errors.description = "Nimalar qila olishingizni batafsilroq yozing (kamida 20 ta belgi)."
  else if (d.length > 1500) errors.description = "Tavsif 1500 ta belgidan oshmasligi kerak."

  const contacts = validateContacts({ phone, instagram, telegram })
  Object.assign(errors, contacts.errors)

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: { title: t, category, description: d, contacts: contacts.values },
  }
}
