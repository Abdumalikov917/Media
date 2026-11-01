import { Link } from "react-router-dom"
import { getCategory } from "../data/categories"
import { initials, timeAgo } from "../utils/format"
import Icon from "./Icons"

export default function MediaCard({ ad }) {
  const category = getCategory(ad.category)

  return (
    <Link to={`/ads/${ad.id}`} className="ad-card">
      {category && (
        <span className="tag">
          <span aria-hidden="true">{category.icon}</span>
          {category.name}
        </span>
      )}
      <h3 className="ad-card__title">{ad.title}</h3>
      <p className="ad-card__text">{ad.description}</p>
      <div className="ad-card__footer">
        <span className="ad-card__author">
          <span className="avatar" aria-hidden="true">
            {initials(ad.authorName)}
          </span>
          <span>{ad.authorName}</span>
        </span>
        <span className="ad-card__meta">
          <span title="Ko'rishlar soni">
            <Icon name="eye" size={15} />
            {ad.views}
          </span>
          <span>{timeAgo(ad.createdAt)}</span>
        </span>
      </div>
    </Link>
  )
}
