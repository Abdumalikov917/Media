import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

/** Faqat kirgan foydalanuvchilar uchun. role berilsa, faqat shu turdagi akkaunt kira oladi. */
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
