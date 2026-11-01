import { useEffect, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useUnread } from "../hooks/useUnread"
import Button from "./Button"
import Icon from "./Icons"

function BrandMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <rect width="30" height="30" rx="9" fill="#7657F6" />
      <path d="M12 9.5v11l9-5.5-9-5.5z" fill="#fff" />
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const unread = useUnread(user?.id)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  function handleLogout() {
    logout()
    navigate("/")
  }

  const linkClass = ({ isActive }) => `navbar__link${isActive ? " active" : ""}`

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand" aria-label="Media, bosh sahifa">
          <BrandMark />
          Media
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>

        <nav id="nav-menu" className={`navbar__menu${open ? " is-open" : ""}`} aria-label="Asosiy menyu">
          <NavLink to="/" end className={linkClass}>
            Bosh sahifa
          </NavLink>
          <NavLink to="/ads" className={linkClass}>
            E'lonlar
          </NavLink>

          <div className="navbar__actions">
            {user ? (
              <>
                <NavLink to="/dashboard/messages" className={linkClass}>
                  Xabarlar
                  {unread > 0 && <span className="badge">{unread}</span>}
                </NavLink>
                <NavLink to="/dashboard" end className={linkClass}>
                  Kabinet
                </NavLink>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Chiqish
                </Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">
                  Kirish
                </Button>
                <Button to="/register" size="sm">
                  Ro'yxatdan o'tish
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
