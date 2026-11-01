import { read, write, KEYS } from "../utils/storage"
import { ValidationError, validateName } from "../utils/validators"

export function getUsers() {
  return read(KEYS.users, [])
}

/** Boshqa foydalanuvchilarga ko'rinadigan ma'lumot (email va parolsiz). */
export function getPublicUser(id) {
  const u = getUsers().find((x) => x.id === id)
  if (!u) return null
  return { id: u.id, name: u.name, role: u.role, createdAt: u.createdAt }
}

export function updateName(id, name) {
  const error = validateName(name)
  if (error) throw new ValidationError(error, { name: error })

  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) throw new Error("Foydalanuvchi topilmadi.")

  users[index] = { ...users[index], name: String(name).trim() }
  write(KEYS.users, users)

  const { passwordHash, salt, ...publicUser } = users[index]
  return publicUser
}
