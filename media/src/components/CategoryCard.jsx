import { Link } from "react-router-dom"

export default function CategoryCard({ category, count = 0 }) {
  return (
    <Link to={`/ads?category=${category.id}`} className="category-card">
      <span className="category-card__icon" aria-hidden="true">
        {category.icon}
      </span>
      <span>
        <span className="category-card__name">{category.name}</span>
        <span className="category-card__count">{count} ta e'lon</span>
      </span>
    </Link>
  )
}
