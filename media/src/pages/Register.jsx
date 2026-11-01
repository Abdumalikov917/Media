import { Link, Navigate } from "react-router-dom"
import Button from "../components/Button"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

export default function Register() {
  const { user } = useAuth()
  useDocumentTitle("Ro'yxatdan o'tish")

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="container">
      <div className="auth auth--wide">
        <h1>Ro'yxatdan o'tish</h1>
        <p className="auth__lead">Akkaunt turini tanlang.</p>

        <div className="choice-list">
          <section className="card choice">
            <h2>Mijoz</h2>
            <p>
              Men media mutaxassisini qidiryapman. E'lonlarni ko'raman, ism va kategoriya bo'yicha qidiraman, chatda
              yozaman.
            </p>
            <Button to="/register/client">Mijoz sifatida ro'yxatdan o'tish</Button>
          </section>

          <section className="card choice">
            <h2>Mediachi</h2>
            <p>
              Men media sohasida ishlayman. Nimalar qila olishimni e'lon qilaman va mijozlar men bilan bog'lanadi.
            </p>
            <Button to="/register/media" variant="ghost">
              Mediachi sifatida ro'yxatdan o'tish
            </Button>
          </section>
        </div>

        <p className="auth__alt">
          Akkauntingiz bormi?{" "}
          <Link to="/login" className="link">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  )
}
