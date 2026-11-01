import { useMemo } from "react"
import { Link } from "react-router-dom"
import AdGrid from "../components/AdGrid"
import Button from "../components/Button"
import CategoryCard from "../components/CategoryCard"
import SearchBar from "../components/SearchBar"
import { CATEGORIES } from "../data/categories"
import { countByCategory, getNewestAds, getPopularAds } from "../services/adService"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

export default function Home() {
  const { user } = useAuth()
  useDocumentTitle("")

  const newest = useMemo(() => getNewestAds(6), [])
  const popular = useMemo(() => getPopularAds(3), [])
  const counts = useMemo(() => countByCategory(), [])

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Media mutaxassisini toping yoki o'zingizni taklif qiling</h1>
          <p className="hero__lead">
            Operator, montajchi, SMM menejer, dizayner, fotograf va boshqalar. E'lonlarni ko'ring va kerakli odamga
            chatda yoki telefon, Instagram, Telegram orqali yozing.
          </p>
          <SearchBar />
          <div className="hero__actions">
            {user ? (
              <Button to="/dashboard" variant="ghost">
                Kabinetga o'tish
              </Button>
            ) : (
              <>
                <Button to="/register/client" variant="ghost">
                  Mijoz sifatida kirish
                </Button>
                <Button to="/register/media" variant="ghost">
                  Mediachi sifatida e'lon berish
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Kategoriyalar</h2>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.id} category={c} count={counts[c.id]} />
            ))}
          </div>
        </div>
      </section>

      {popular.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__head">
              <h2>Eng ko'p ko'rilgan e'lonlar</h2>
              <Link to="/ads?sort=popular" className="link">
                Hammasini ko'rish
              </Link>
            </div>
            <AdGrid ads={popular} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Yangi e'lonlar</h2>
            {newest.length > 0 && (
              <Link to="/ads" className="link">
                Hammasini ko'rish
              </Link>
            )}
          </div>
          <AdGrid
            ads={newest}
            emptyTitle="Hozircha e'lonlar yo'q"
            emptyText="Siz mediachi bo'lsangiz, birinchi e'lonni o'zingiz joylang."
            emptyAction={
              !user && (
                <Button to="/register/media" size="sm">
                  Mediachi sifatida ro'yxatdan o'tish
                </Button>
              )
            }
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Qanday ishlaydi</h2>
          </div>
          <ol className="steps">
            <li>
              <h3>Mediachi e'lon beradi</h3>
              <p>
                Kategoriyani tanlaydi, nimalar qila olishini yozadi va telefon, Instagram yoki Telegram'dan birini
                qo'shadi.
              </p>
            </li>
            <li>
              <h3>Mijoz topadi</h3>
              <p>Ism yoki kategoriya bo'yicha qidiradi, yangi va eng ko'p ko'rilgan e'lonlarni ko'radi.</p>
            </li>
            <li>
              <h3>Ular bog'lanadi</h3>
              <p>Saytdagi chatda yozadi yoki e'londa ko'rsatilgan aloqa usulidan foydalanadi.</p>
            </li>
          </ol>
        </div>
      </section>

      {!user && (
        <section className="section">
          <div className="container">
            <div className="cta-band">
              <div>
                <h2>Media sohasida ishlaysizmi?</h2>
                <p>Ro'yxatdan o'ting va xizmatlaringiz haqida e'lon bering.</p>
              </div>
              <Button to="/register/media" size="lg">
                Mediachi sifatida boshlash
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
