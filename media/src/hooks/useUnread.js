import { useEffect, useState } from "react"
import { subscribe, unreadCount } from "../services/chatService"

/** O'qilmagan xabarlar soni (boshqa tabdagi o'zgarishlarni ham kuzatadi). */
export function useUnread(userId) {
  const [count, setCount] = useState(() => unreadCount(userId))

  useEffect(() => {
    setCount(unreadCount(userId))
    return subscribe(() => setCount(unreadCount(userId)))
  }, [userId])

  return count
}
