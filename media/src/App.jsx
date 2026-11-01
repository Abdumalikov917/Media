import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "./layouts/DashboardLayout"
import MainLayout from "./layouts/MainLayout"
import { useAuth } from "./hooks/useAuth"
import AdDetails from "./pages/AdDetails"
import Ads from "./pages/Ads"
import ClientDashboard from "./pages/ClientDashboard"
import ClientRegister from "./pages/ClientRegister"
import CreateAd from "./pages/CreateAd"
import Home from "./pages/Home"
import Login from "./pages/Login"
import MediaDashboard from "./pages/MediaDashboard"
import MediaRegister from "./pages/MediaRegister"
import Messages from "./pages/Messages"
import NotFound from "./pages/NotFound"
import Profile from "./pages/Profile"
import Register from "./pages/Register"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** /dashboard: akkaunt turiga qarab mos bosh panelni ko'rsatadi. */
function DashboardHome() {
  const { user } = useAuth()
  return user.role === "media" ? <MediaDashboard /> : <ClientDashboard />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="ads" element={<Ads />} />
          <Route path="ads/:id" element={<AdDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register/client" element={<ClientRegister />} />
          <Route path="register/media" element={<MediaRegister />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route
            path="create-ad"
            element={
              <ProtectedRoute role="media">
                <CreateAd />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-ad/:id"
            element={
              <ProtectedRoute role="media">
                <CreateAd />
              </ProtectedRoute>
            }
          />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </>
  )
}
