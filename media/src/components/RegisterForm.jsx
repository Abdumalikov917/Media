import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { validateEmail, validateName, validatePassword } from "../utils/validators"
import Button from "./Button"
import Field from "./Field"

export default function RegisterForm({ role, title, lead, submitLabel }) {
  const { user, register } = useAuth()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError("")

    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    }
    if (!next.password && form.password !== form.confirm) next.confirm = "Parollar bir xil emas."
    Object.keys(next).forEach((k) => !next[k] && delete next[k])
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, role })
    } catch (err) {
      if (err.fields) setErrors(err.fields)
      else setFormError(err.message || "Ro'yxatdan o'tib bo'lmadi. Qaytadan urinib ko'ring.")
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <h1>{title}</h1>
      <p className="auth__lead">{lead}</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="alert alert--error" role="alert">
            {formError}
          </div>
        )}
        <Field
          id="name"
          label="Ismingiz"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
          placeholder="Masalan: Aziz Karimov"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
          placeholder="ism@gmail.com"
        />
        <Field
          id="password"
          label="Parol"
          type="password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          hint="Kamida 6 ta belgi."
          autoComplete="new-password"
        />
        <Field
          id="confirm"
          label="Parolni takrorlang"
          type="password"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          autoComplete="new-password"
        />
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? "Yuborilmoqda..." : submitLabel}
        </Button>
      </form>

      <p className="auth__alt">
        Akkauntingiz bormi?{" "}
        <Link to="/login" className="link">
          Kirish
        </Link>
      </p>
      <p className="auth__alt">
        Boshqa turdagi akkaunt kerakmi?{" "}
        <Link to="/register" className="link">
          Turini o'zgartirish
        </Link>
      </p>
    </div>
  )
}
