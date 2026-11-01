import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Button from "../components/Button"
import Icon from "../components/Icons"
import { listConversations, markRead, sendMessage, subscribe } from "../services/chatService"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { formatTime, initials, timeAgo } from "../utils/format"

export default function Messages() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const activeId = params.get("c") || ""
  const [chats, setChats] = useState(() => listConversations(user.id))
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const messagesRef = useRef(null)
  useDocumentTitle("Xabarlar")

  // Yangi xabar kelganda (shu yoki boshqa tabda) ro'yxat yangilanadi.
  useEffect(() => {
    setChats(listConversations(user.id))
    return subscribe(() => setChats(listConversations(user.id)))
  }, [user.id])

  const active = chats.find((c) => c.id === activeId) || null

  // Ochiq suhbatdagi xabarlar o'qilgan deb belgilanadi.
  useEffect(() => {
    if (active && active.unread > 0) markRead(active.id, user.id)
  }, [active, user.id])

  // Pastga aylantirish.
  const messageCount = active?.messages.length ?? 0
  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [active?.id, messageCount])

  useEffect(() => {
    setText("")
    setError("")
  }, [activeId])

  function handleSubmit(e) {
    e.preventDefault()
    if (!active || !text.trim()) return
    setError("")
    try {
      sendMessage(active.id, user.id, text)
      setText("")
    } catch (err) {
      setError(err.message)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  if (chats.length === 0) {
    return (
      <div>
        <div className="page-head">
          <h1>Xabarlar</h1>
        </div>
        <div className="empty">
          <h3>Hozircha suhbatlar yo'q</h3>
          <p>
            {user.role === "media"
              ? "Mijozlar e'loningiz orqali yozganda, suhbatlar shu yerda ko'rinadi."
              : "E'lonni oching va \"Chatda yozish\" tugmasini bosing."}
          </p>
          {user.role !== "media" && (
            <Button to="/ads" size="sm">
              E'lonlarni ko'rish
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <h1>Xabarlar</h1>
      </div>

      <div className={`chat${active ? " has-active" : ""}`}>
        <div className="chat__list" role="list" aria-label="Suhbatlar">
          {chats.map((c) => (
            <Link
              key={c.id}
              to={`/dashboard/messages?c=${c.id}`}
              role="listitem"
              className={`chat__item${c.id === activeId ? " is-active" : ""}`}
            >
              <span className="chat__item-top">
                <strong>{c.otherName}</strong>
                {c.unread > 0 && <span className="badge">{c.unread}</span>}
              </span>
              <small>{c.adTitle}</small>
              <p>{c.last ? c.last.text : "Hali xabar yo'q"}</p>
            </Link>
          ))}
        </div>

        <section className="chat__pane" aria-label="Suhbat">
          {active ? (
            <>
              <div className="chat__head">
                <Link to="/dashboard/messages" className="chat__back" aria-label="Suhbatlar ro'yxatiga qaytish">
                  <Icon name="close" size={16} />
                </Link>
                <span className="avatar" aria-hidden="true">
                  {initials(active.otherName)}
                </span>
                <div>
                  <strong>{active.otherName}</strong>
                  {active.adExists ? (
                    <small>
                      <Link to={`/ads/${active.adId}`} className="link">
                        {active.adTitle}
                      </Link>
                    </small>
                  ) : (
                    <small>{active.adTitle} (e'lon o'chirilgan)</small>
                  )}
                </div>
              </div>

              <div className="chat__messages" ref={messagesRef}>
                {active.messages.length === 0 ? (
                  <p className="chat__placeholder">Birinchi xabarni yozing.</p>
                ) : (
                  active.messages.map((m) => (
                    <div key={m.id} className={`bubble${m.senderId === user.id ? " bubble--mine" : ""}`}>
                      {m.text}
                      <small title={timeAgo(m.createdAt)}>{formatTime(m.createdAt)}</small>
                    </div>
                  ))
                )}
              </div>

              {error && (
                <div className="alert alert--error" role="alert">
                  {error}
                </div>
              )}

              <form className="composer" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="message">
                  Xabar
                </label>
                <textarea
                  id="message"
                  className="textarea"
                  rows={1}
                  maxLength={2000}
                  placeholder="Xabar yozing"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="submit" disabled={!text.trim()}>
                  Yuborish
                </Button>
              </form>
            </>
          ) : (
            <p className="chat__placeholder">Suhbatni tanlang.</p>
          )}
        </section>
      </div>
    </div>
  )
}
