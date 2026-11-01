import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} Media. Mediachilar va mijozlar uchun.</p>
        <nav className="footer__links" aria-label="Sayt bo'limlari">
          <Link to="/ads">E'lonlar</Link>
          <Link to="/register/client">Mijoz bo'lish</Link>
          <Link to="/register/media">Mediachi bo'lish</Link>
        </nav>
      </div>
    </footer>
  )
}
