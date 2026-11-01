export const CATEGORIES = [
  { id: "operator", name: "Operator", icon: "🎥", hint: "Video va syomka" },
  { id: "video-montajchi", name: "Video montajchi", icon: "✂️", hint: "Montaj va rangtuzatish" },
  { id: "ssenariynavis", name: "Ssenariynavis", icon: "✍️", hint: "Ssenariy va matn" },
  { id: "content-creator", name: "Content Creator", icon: "💡", hint: "Kontent g'oyalari va yaratish" },
  { id: "smm-manager", name: "SMM Manager", icon: "📱", hint: "Ijtimoiy tarmoqlarni yuritish" },
  { id: "grafik-dizayner", name: "Grafik dizayner", icon: "🎨", hint: "Logotip, banner, dizayn" },
  { id: "digital-marketer", name: "Digital Marketer", icon: "📈", hint: "Reklama va targeting" },
  { id: "fotograf", name: "Fotograf", icon: "📷", hint: "Foto syomka" },
  { id: "ovoz-rejissyor", name: "Ovoz rejissyor", icon: "🎙️", hint: "Ovoz yozish va ishlov berish" },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null
}
