import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Field from "../components/Field"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { formatDate } from "../utils/format"

export default function Profile() {
  const { user, updateName, logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  useDocumentTitle("Profil")

  function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSaved(false)
    try {
      updateName(name)
      setSaved(true)
    } catch (err) {
      setError(err.fields?.name || err.message)
    }
  }

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <div>
      <div className="page-head">
        <h1>Profil</h1>
      </div>

      <div className="profile-grid">
        <form className="form card" onSubmit={handleSubmit} noValidate>
          {saved && (
            <div className="alert alert--success" role="status">
              Ism saqlandi.
            </div>
          )}
          <Field
            id="name"
            label="Ism"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSaved(false)
            }}
            error={error}
            autoComplete="name"
          />
          <Field id="email" label="Email" value={user.email} readOnly />
          <div className="profile-meta">
            <span>Akkaunt turi: {user.role === "media" ? "Mediachi" : "Mijoz"}</span>
            <span>Ro'yxatdan o'tgan sana: {formatDate(user.createdAt)}</span>
          </div>
          <div className="ad-row__actions">
            <Button type="submit">Saqlash</Button>
          </div>
        </form>

        <div>
          <Button variant="danger" onClick={handleLogout}>
            Chiqish
          </Button>
        </div>
      </div>
    </div>
  )
}
