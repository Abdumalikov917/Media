import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import Icon from "../components/Icons"
import { getCategory } from "../data/categories"
import { deleteAd, listAdsByUser } from "../services/adService"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { useUnread } from "../hooks/useUnread"
import { timeAgo } from "../utils/format"

export default function MediaDashboard() {
  const { user } = useAuth()
  const unread = useUnread(user.id)
  const [ads, setAds] = useState(() => listAdsByUser(user.id))
  const [error, setError] = useState("")
  useDocumentTitle("E'lonlarim")

  const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0)

  function handleDelete(ad) {
    if (!window.confirm(`"${ad.title}" e'lonini o'chirasizmi? Buni qaytarib bo'lmaydi.`)) return
    setError("")
    try {
      deleteAd(user, ad.id)
      setAds(listAdsByUser(user.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Salom, {user.name}</h1>
        <p>Bu yerda e'lonlaringizni boshqarasiz va mijozlarning xabarlarini ko'rasiz.</p>
      </div>

      <div className="stats">
        <div className="stat">
          <strong>{ads.length}</strong>
          <span>e'lon</span>
        </div>
        <div className="stat">
          <strong>{totalViews}</strong>
          <span>jami ko'rishlar</span>
        </div>
        <Link to="/dashboard/messages" className="stat">
          <strong>{unread}</strong>
          <span>o'qilmagan xabar</span>
        </Link>
      </div>

      <section>
        <div className="section__head">
          <h2>Mening e'lonlarim</h2>
          <Button to="/dashboard/create-ad" size="sm">
            <Icon name="plus" size={16} />
            Yangi e'lon
          </Button>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        {ads.length === 0 ? (
          <div className="empty">
            <h3>Hali e'lon joylamadingiz</h3>
            <p>Kategoriyani tanlang, nimalar qila olishingizni yozing va aloqa usulini qo'shing.</p>
            <Button to="/dashboard/create-ad" size="sm">
              Birinchi e'lonni joylash
            </Button>
          </div>
        ) : (
          <div className="ad-list">
            {ads.map((ad) => {
              const category = getCategory(ad.category)
              return (
                <article key={ad.id} className="ad-row">
                  <div>
                    {category && (
                      <span className="tag">
                        <span aria-hidden="true">{category.icon}</span>
                        {category.name}
                      </span>
                    )}
                    <h3>{ad.title}</h3>
                    <div className="ad-row__meta">
                      <span>
                        <Icon name="eye" size={15} />
                        {ad.views} ko'rish
                      </span>
                      <span>{timeAgo(ad.createdAt)}</span>
                    </div>
                  </div>
                  <div className="ad-row__actions">
                    <Button to={`/ads/${ad.id}`} variant="ghost" size="sm">
                      Ko'rish
                    </Button>
                    <Button to={`/dashboard/edit-ad/${ad.id}`} variant="ghost" size="sm">
                      <Icon name="edit" size={15} />
                      Tahrirlash
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(ad)}>
                      <Icon name="trash" size={15} />
                      O'chirish
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
