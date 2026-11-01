import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Field from "../components/Field"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  useDocumentTitle("Kirish")

  const from = location.state?.from || "/dashboard"

  if (user) return <Navigate to={from} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!form.email.trim() || !form.password) {
      setError("Email va parolni kiriting.")
      return
    }
    setBusy(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || "Kirib bo'lmadi. Qaytadan urinib ko'ring.")
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="auth">
        <h1>Kirish</h1>
        <p className="auth__lead">Akkauntingizga kiring.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}
          <Field
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            autoComplete="email"
            placeholder="ism@gmail.com"
          />
          <Field
            id="password"
            label="Parol"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
          />
          <Button type="submit" size="lg" block disabled={busy}>
            {busy ? "Kirilmoqda..." : "Kirish"}
          </Button>
        </form>

        <p className="auth__alt">
          Akkauntingiz yo'qmi?{" "}
          <Link to="/register" className="link">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  )
}
