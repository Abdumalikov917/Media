import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import AdGrid from "../components/AdGrid"
import Button from "../components/Button"
import SearchBar from "../components/SearchBar"
import { CATEGORIES } from "../data/categories"
import { listAds } from "../services/adService"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

export default function Ads() {
  useDocumentTitle("E'lonlar")
  const [params, setParams] = useSearchParams()

  const q = params.get("q") || ""
  const category = params.get("category") || ""
  const sort = params.get("sort") === "popular" ? "popular" : "new"

  const ads = useMemo(() => listAds({ q, category, sort }), [q, category, sort])
  const filtered = Boolean(q || category)

  function update(next) {
    const p = new URLSearchParams(params)
    for (const [key, value] of Object.entries(next)) {
      if (value) p.set(key, value)
      else p.delete(key)
    }
    setParams(p)
  }

  return (
    <div className="container page">
      <div className="page-head">
        <h1>E'lonlar</h1>
        <p>Ism yoki xizmat bo'yicha qidiring, kategoriyani tanlang va kerakli mutaxassisni toping.</p>
      </div>

      <SearchBar
        initialQuery={q}
        initialCategory={category}
        onSearch={(query, cat) => update({ q: query, category: cat })}
      />

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Kategoriya bo'yicha filtr">
          <button
            type="button"
            className={`chip${category === "" ? " is-active" : ""}`}
            aria-pressed={category === ""}
            onClick={() => update({ category: "" })}
          >
            Hammasi
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip${category === c.id ? " is-active" : ""}`}
              aria-pressed={category === c.id}
              onClick={() => update({ category: c.id })}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar">
        <p className="toolbar__count" aria-live="polite">
          {ads.length} ta e'lon
        </p>
        <div className="chips" role="group" aria-label="Saralash">
          <button
            type="button"
            className={`chip${sort === "new" ? " is-active" : ""}`}
            aria-pressed={sort === "new"}
            onClick={() => update({ sort: "" })}
          >
            Yangilari
          </button>
          <button
            type="button"
            className={`chip${sort === "popular" ? " is-active" : ""}`}
            aria-pressed={sort === "popular"}
            onClick={() => update({ sort: "popular" })}
          >
            Eng ko'p ko'rilgan
          </button>
        </div>
      </div>

      <AdGrid
        ads={ads}
        emptyTitle={filtered ? "Hech narsa topilmadi" : "Hozircha e'lonlar yo'q"}
        emptyText={
          filtered
            ? "Boshqa so'z yoki kategoriya bilan qidirib ko'ring."
            : "Mediachilar e'lon joylagach, ular shu yerda ko'rinadi."
        }
        emptyAction={
          filtered && (
            <Button variant="ghost" size="sm" onClick={() => update({ q: "", category: "" })}>
              Filtrlarni tozalash
            </Button>
          )
        }
      />
    </div>
  )
}
