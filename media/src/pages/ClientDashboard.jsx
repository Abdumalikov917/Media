import { useMemo } from "react"
import { Link } from "react-router-dom"
import AdGrid from "../components/AdGrid"
import SearchBar from "../components/SearchBar"
import { CATEGORIES } from "../data/categories"
import { getNewestAds, getPopularAds } from "../services/adService"
import { listConversations } from "../services/chatService"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { timeAgo } from "../utils/format"

export default function ClientDashboard() {
  const { user } = useAuth()
  useDocumentTitle("Bosh panel")

  const newest = useMemo(() => getNewestAds(6), [])
  const popular = useMemo(() => getPopularAds(3), [])
  const chats = useMemo(() => listConversations(user.id).slice(0, 3), [user.id])

  return (
    <>
      <div className="page-head">
        <h1>Salom, {user.name}</h1>
        <p>Kerakli mutaxassisni qidiring: ism yoki kategoriya bo'yicha.</p>
      </div>

      <SearchBar />

      <div className="chips" aria-label="Kategoriyalar">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to={`/ads?category=${c.id}`} className="chip">
            <span aria-hidden="true">{c.icon}</span>
            {c.name}
          </Link>
        ))}
      </div>

      {chats.length > 0 && (
        <section>
          <div className="section__head">
            <h2>So'nggi suhbatlar</h2>
            <Link to="/dashboard/messages" className="link">
              Hammasi
            </Link>
          </div>
          <div className="ad-list">
            {chats.map((c) => (
              <Link key={c.id} to={`/dashboard/messages?c=${c.id}`} className="ad-row">
                <div>
                  <h3>{c.otherName}</h3>
                  <div className="ad-row__meta">
                    <span>{c.adTitle}</span>
                    <span>{timeAgo(c.updatedAt)}</span>
                  </div>
                </div>
                {c.unread > 0 && <span className="badge">{c.unread}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {popular.length > 0 && (
        <section>
          <div className="section__head">
            <h2>Eng ko'p ko'rilgan e'lonlar</h2>
            <Link to="/ads?sort=popular" className="link">
              Hammasi
            </Link>
          </div>
          <AdGrid ads={popular} />
        </section>
      )}

      <section>
        <div className="section__head">
          <h2>Yangi e'lonlar</h2>
          {newest.length > 0 && (
            <Link to="/ads" className="link">
              Hammasi
            </Link>
          )}
        </div>
        <AdGrid
          ads={newest}
          emptyTitle="Hozircha e'lonlar yo'q"
          emptyText="Mediachilar e'lon joylagach, ular shu yerda ko'rinadi."
        />
      </section>
    </>
  )
}
