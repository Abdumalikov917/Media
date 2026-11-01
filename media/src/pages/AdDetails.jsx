import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import Button from "../components/Button"
import Icon from "../components/Icons"
import { getCategory } from "../data/categories"
import { getAd, registerView } from "../services/adService"
import { startConversation } from "../services/chatService"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { formatPhone, initials, timeAgo } from "../utils/format"

export default function AdDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [ad, setAd] = useState(() => getAd(id))
  const [error, setError] = useState("")

  useDocumentTitle(ad?.title)

  // Sahifa ochilganda ko'rishlar sonini oshiradi (bir sessiyada bir marta).
  useEffect(() => {
    setAd(registerView(id, user?.id))
  }, [id, user?.id])

  if (!ad) {
    return (
      <div className="container page">
        <div className="empty">
          <h3>E'lon topilmadi</h3>
          <p>U o'chirilgan bo'lishi yoki havola noto'g'ri bo'lishi mumkin.</p>
          <Button to="/ads" size="sm">
            Barcha e'lonlarni ko'rish
          </Button>
        </div>
      </div>
    )
  }

  const category = getCategory(ad.category)
  const isOwner = user?.id === ad.userId
  const { phone, instagram, telegram } = ad.contacts

  function handleChat() {
    setError("")
    if (!user) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    try {
      const chatId = startConversation({ adId: ad.id, userId: user.id })
      navigate(`/dashboard/messages?c=${chatId}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container page">
      <div className="detail">
        <article className="detail__main">
          {category && (
            <Link to={`/ads?category=${category.id}`} className="tag">
              <span aria-hidden="true">{category.icon}</span>
              {category.name}
            </Link>
          )}
          <h1>{ad.title}</h1>
          <div className="detail__author">
            <span className="avatar" aria-hidden="true">
              {initials(ad.authorName)}
            </span>
            <span>
              <strong>{ad.authorName}</strong>
              {timeAgo(ad.createdAt)} joylangan, {ad.views} marta ko'rilgan
            </span>
          </div>
          <p className="detail__text">{ad.description}</p>
        </article>

        <aside className="card detail__aside" aria-label="Bog'lanish">
          <h2>Bog'lanish</h2>

          <div className="contact-list">
            {phone && (
              <a className="contact" href={`tel:${phone}`}>
                <Icon name="phone" />
                <div>
                  <small>Telefon</small>
                  <span>{formatPhone(phone)}</span>
                </div>
              </a>
            )}
            {instagram && (
              <a className="contact" href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">
                <Icon name="instagram" />
                <div>
                  <small>Instagram</small>
                  <span>@{instagram}</span>
                </div>
              </a>
            )}
            {telegram && (
              <a className="contact" href={`https://t.me/${telegram}`} target="_blank" rel="noopener noreferrer">
                <Icon name="telegram" />
                <div>
                  <small>Telegram</small>
                  <span>@{telegram}</span>
                </div>
              </a>
            )}
          </div>

          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          {isOwner ? (
            <>
              <p className="hint">Bu sizning e'loningiz.</p>
              <Button to={`/dashboard/edit-ad/${ad.id}`} variant="ghost" block>
                <Icon name="edit" size={16} />
                Tahrirlash
              </Button>
            </>
          ) : (
            <Button block onClick={handleChat}>
              <Icon name="chat" size={16} />
              {user ? "Chatda yozish" : "Chatda yozish uchun kiring"}
            </Button>
          )}
        </aside>
      </div>
    </div>
  )
}
