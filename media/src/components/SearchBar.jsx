import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CATEGORIES } from "../data/categories"
import Icon from "./Icons"

/**
 * Ism/xizmat va kategoriya bo'yicha qidiruv.
 * onSearch berilmasa, /ads sahifasiga o'tadi.
 */
export default function SearchBar({ initialQuery = "", initialCategory = "", onSearch }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)

  useEffect(() => {
    setQuery(initialQuery)
    setCategory(initialCategory)
  }, [initialQuery, initialCategory])

  function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    if (onSearch) {
      onSearch(q, category)
      return
    }
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (category) params.set("category", category)
    const qs = params.toString()
    navigate(qs ? `/ads?${qs}` : "/ads")
  }

  return (
    <form className="searchbar" role="search" onSubmit={handleSubmit}>
      <label className="searchbar__field">
        <Icon name="search" />
        <span className="sr-only">Ism yoki xizmat</span>
        <input
          type="search"
          placeholder="Ism yoki xizmat bo'yicha qidiring"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <label className="searchbar__field">
        <span className="sr-only">Kategoriya</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Barcha kategoriyalar</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <button className="btn btn--lg" type="submit">
        Qidirish
      </button>
    </form>
  )
}
