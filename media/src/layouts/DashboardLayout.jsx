import { NavLink, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"
import { useUnread } from "../hooks/useUnread"

export default function DashboardLayout() {
  const { user } = useAuth()
  const unread = useUnread(user.id)
  const isMedia = user.role === "media"
  const linkClass = ({ isActive }) => `side-link${isActive ? " active" : ""}`

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <nav className="dashboard__nav" aria-label="Kabinet menyusi">
          <NavLink to="/dashboard" end className={linkClass}>
            {isMedia ? "E'lonlarim" : "Bosh panel"}
          </NavLink>
          {isMedia && (
            <NavLink to="/dashboard/create-ad" className={linkClass}>
              Yangi e'lon
            </NavLink>
          )}
          <NavLink to="/dashboard/messages" className={linkClass}>
            Xabarlar
            {unread > 0 && <span className="badge">{unread}</span>}
          </NavLink>
          <NavLink to="/dashboard/profile" className={linkClass}>
            Profil
          </NavLink>
        </nav>
        <main className="dashboard__content">
          <Outlet />
        </main>
      </div>
    </>
  )
}
