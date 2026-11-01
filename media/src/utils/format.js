const pad = (n) => String(n).padStart(2, "0")

export function formatDate(ts) {
  const d = new Date(ts)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

export function formatTime(ts) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function timeAgo(ts, now = Date.now()) {
  const minutes = Math.floor(Math.max(0, now - ts) / 60000)
  if (minutes < 1) return "hozirgina"
  if (minutes < 60) return `${minutes} daqiqa oldin`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} soat oldin`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} kun oldin`
  return formatDate(ts)
}

export function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return "?"
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("")
}

export function formatPhone(phone) {
  const m = /^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(String(phone || ""))
  return m ? `+998 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : String(phone || "")
}

export function truncate(text, max = 80) {
  const s = String(text || "")
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s
}
