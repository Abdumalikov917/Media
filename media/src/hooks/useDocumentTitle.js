import { useEffect } from "react"

const DEFAULT_TITLE = "Media — mediachilar va mijozlar uchun"

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Media` : DEFAULT_TITLE
  }, [title])
}
