import { read, write, remove, makeId, KEYS } from "../utils/storage"
import { ValidationError, validateEmail, validateName, validatePassword } from "../utils/validators"
import { getUsers } from "./userService"

export const ROLES = { CLIENT: "client", MEDIA: "media" }

// Eslatma: bu demo darajadagi autentifikatsiya (hammasi brauzerda).
// Haqiqiy saytda parol tekshiruvi serverda bo'lishi kerak.
async function hashPassword(password, salt) {
  const text = `${salt}:${password}`
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0
  return `x${h >>> 0}`
}

function toPublicUser(user) {
  if (!user) return null
  const { passwordHash, salt, ...rest } = user
  return rest
}

export async function register({ name, email, password, role }) {
  const fields = {}
  const nameError = validateName(name)
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)
  if (nameError) fields.name = nameError
  if (emailError) fields.email = emailError
  if (passwordError) fields.password = passwordError
  if (!Object.values(ROLES).includes(role)) throw new Error("Akkaunt turi noto'g'ri tanlangan.")
  if (Object.keys(fields).length) throw new ValidationError("Maydonlarni tekshiring.", fields)

  const normalizedEmail = String(email).trim().toLowerCase()
  const users = getUsers()
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new ValidationError("Bu email bilan akkaunt allaqachon mavjud.", {
      email: "Bu email bilan akkaunt allaqachon mavjud. Kirishni sinab ko'ring.",
    })
  }

  const salt = makeId()
  const user = {
    id: makeId(),
    name: String(name).trim(),
    email: normalizedEmail,
    role,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: Date.now(),
  }
  write(KEYS.users, [...users, user])
  write(KEYS.session, user.id)
  return toPublicUser(user)
}

export async function login({ email, password }) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase()
  const user = getUsers().find((u) => u.email === normalizedEmail)
  const fail = () => new Error("Email yoki parol noto'g'ri.")
  if (!user) throw fail()
  const hash = await hashPassword(String(password ?? ""), user.salt)
  if (hash !== user.passwordHash) throw fail()
  write(KEYS.session, user.id)
  return toPublicUser(user)
}

export function logout() {
  remove(KEYS.session)
}

export function getCurrentUser() {
  const id = read(KEYS.session, null)
  if (!id) return null
  return toPublicUser(getUsers().find((u) => u.id === id))
}
