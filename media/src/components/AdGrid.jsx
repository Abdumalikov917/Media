import MediaCard from "./MediaCard"

/** E'lonlar to'ri. Ro'yxat bo'sh bo'lsa, bo'sh holat ko'rsatiladi. */
export default function AdGrid({ ads, emptyTitle, emptyText, emptyAction }) {
  if (!ads.length) {
    return (
      <div className="empty">
        <h3>{emptyTitle}</h3>
        {emptyText && <p>{emptyText}</p>}
        {emptyAction}
      </div>
    )
  }

  return (
    <div className="ad-grid">
      {ads.map((ad) => (
        <MediaCard key={ad.id} ad={ad} />
      ))}
    </div>
  )
}
