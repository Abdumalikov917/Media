import { read, write, readSession, writeSession, makeId, KEYS } from "../utils/storage"
import { CATEGORIES, getCategory } from "../data/categories"
import { ValidationError, validateAd } from "../utils/validators"
import { getUsers } from "./userService"

function allAds() {
  return read(KEYS.ads, [])
}

function withAuthors(ads) {
  const names = new Map(getUsers().map((u) => [u.id, u.name]))
  return ads.map((ad) => ({ ...ad, authorName: names.get(ad.userId) || "Mediachi" }))
}

function sortAds(ads, sort) {
  const copy = [...ads]
  if (sort === "popular") copy.sort((a, b) => b.views - a.views || b.createdAt - a.createdAt)
  else copy.sort((a, b) => b.createdAt - a.createdAt)
  return copy
}

/** Qidiruv: sarlavha, tavsif, mediachi ismi va kategoriya nomi bo'yicha. */
export function listAds({ q = "", category = "", sort = "new" } = {}) {
  const terms = String(q).toLowerCase().split(/\s+/).filter(Boolean)
  let ads = withAuthors(allAds())

  if (category) ads = ads.filter((a) => a.category === category)
  if (terms.length) {
    ads = ads.filter((a) => {
      const haystack = [a.title, a.description, a.authorName, getCategory(a.category)?.name ?? ""]
        .join(" ")
        .toLowerCase()
      return terms.every((t) => haystack.includes(t))
    })
  }
  return sortAds(ads, sort)
}

export function getNewestAds(limit = 6) {
  return listAds({ sort: "new" }).slice(0, limit)
}

/** Kamida bir marta ko'rilgan e'lonlar, ko'rishlar soni bo'yicha. */
export function getPopularAds(limit = 6) {
  return listAds({ sort: "popular" })
    .filter((a) => a.views > 0)
    .slice(0, limit)
}

export function listAdsByUser(userId) {
  return sortAds(withAuthors(allAds().filter((a) => a.userId === userId)), "new")
}

export function countByCategory() {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]))
  for (const ad of allAds()) {
    if (ad.category in counts) counts[ad.category] += 1
  }
  return counts
}

export function getAd(id) {
  const ad = allAds().find((a) => a.id === id)
  return ad ? withAuthors([ad])[0] : null
}

/** Ko'rishni hisoblaydi: bir sessiyada bitta e'lon uchun bir marta, egasining o'zi hisobga kirmaydi. */
export function registerView(id, viewerId) {
  const ads = allAds()
  const index = ads.findIndex((a) => a.id === id)
  if (index === -1) return null
  if (viewerId && ads[index].userId === viewerId) return getAd(id)

  const seen = readSession(KEYS.viewed, [])
  if (seen.includes(id)) return getAd(id)

  ads[index] = { ...ads[index], views: (ads[index].views || 0) + 1 }
  write(KEYS.ads, ads)
  writeSession(KEYS.viewed, [...seen, id])
  return getAd(id)
}

function assertMedia(user) {
  if (!user || user.role !== "media") {
    throw new Error("E'lon berish uchun mediachi akkaunti kerak.")
  }
}

export function createAd(user, input) {
  assertMedia(user)
  const result = validateAd(input)
  if (!result.ok) throw new ValidationError("Maydonlarni tekshiring.", result.errors)

  const now = Date.now()
  const ad = { id: makeId(), userId: user.id, ...result.values, views: 0, createdAt: now, updatedAt: now }
  write(KEYS.ads, [ad, ...allAds()])
  return getAd(ad.id)
}

export function updateAd(user, id, input) {
  assertMedia(user)
  const ads = allAds()
  const index = ads.findIndex((a) => a.id === id)
  if (index === -1) throw new Error("E'lon topilmadi.")
  if (ads[index].userId !== user.id) throw new Error("Bu e'lonni tahrirlash huquqingiz yo'q.")

  const result = validateAd(input)
  if (!result.ok) throw new ValidationError("Maydonlarni tekshiring.", result.errors)

  ads[index] = { ...ads[index], ...result.values, updatedAt: Date.now() }
  write(KEYS.ads, ads)
  return getAd(id)
}

export function deleteAd(user, id) {
  assertMedia(user)
  const ads = allAds()
  const ad = ads.find((a) => a.id === id)
  if (!ad) throw new Error("E'lon topilmadi.")
  if (ad.userId !== user.id) throw new Error("Bu e'lonni o'chirish huquqingiz yo'q.")
  write(
    KEYS.ads,
    ads.filter((a) => a.id !== id),
  )
}
