import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/Button"
import Field from "../components/Field"
import { CATEGORIES } from "../data/categories"
import { createAd, getAd, updateAd } from "../services/adService"
import { useAuth } from "../hooks/useAuth"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

const EMPTY = { title: "", category: "", description: "", phone: "", instagram: "", telegram: "" }

export default function CreateAd() {
  const { id } = useParams()
  const editing = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  useDocumentTitle(editing ? "E'lonni tahrirlash" : "Yangi e'lon")

  const [existing] = useState(() => (editing ? getAd(id) : null))
  const [form, setForm] = useState(() =>
    existing
      ? {
          title: existing.title,
          category: existing.category,
          description: existing.description,
          phone: existing.contacts.phone,
          instagram: existing.contacts.instagram,
          telegram: existing.contacts.telegram,
        }
      : EMPTY,
  )
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")

  if (editing && (!existing || existing.userId !== user.id)) {
    return (
      <div className="empty">
        <h3>E'lon topilmadi</h3>
        <p>U o'chirilgan yoki uni tahrirlash huquqingiz yo'q.</p>
        <Button to="/dashboard" size="sm">
          E'lonlarimga qaytish
        </Button>
      </div>
    )
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    setFormError("")
    try {
      const saved = editing ? updateAd(user, id, form) : createAd(user, form)
      navigate(`/ads/${saved.id}`)
    } catch (err) {
      if (err.fields) {
        setErrors(err.fields)
        setFormError("Belgilangan maydonlarni to'g'rilang.")
      } else {
        setFormError(err.message || "E'lonni saqlab bo'lmadi.")
      }
    }
  }

  return (
    <div>
      <div className="page-head">
        <h1>{editing ? "E'lonni tahrirlash" : "Yangi e'lon"}</h1>
        <p>Mijozlar sizni shu e'lon orqali topadi. Nimalar qila olishingizni aniq yozing.</p>
      </div>

      <form className="form card" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="alert alert--error" role="alert">
            {formError}
          </div>
        )}

        <Field
          id="title"
          label="Sarlavha"
          value={form.title}
          onChange={set("title")}
          error={errors.title}
          maxLength={80}
          placeholder="Masalan: Reels va YouTube uchun video montaj"
        />

        <fieldset className="fieldset">
          <legend className="label">Kategoriya</legend>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <label key={c.id} className="chip-radio">
                <input
                  type="radio"
                  name="category"
                  value={c.id}
                  checked={form.category === c.id}
                  onChange={set("category")}
                />
                <span className="chip">
                  <span aria-hidden="true">{c.icon}</span>
                  {c.name}
                </span>
              </label>
            ))}
          </div>
          {errors.category && (
            <p className="error-text" role="alert">
              {errors.category}
            </p>
          )}
        </fieldset>

        <Field
          id="description"
          label="Nimalar qila olasiz?"
          multiline
          value={form.description}
          onChange={set("description")}
          error={errors.description}
          maxLength={1500}
          hint={`${form.description.length} / 1500`}
          placeholder="Men shunday narsalar qila olaman: ... Tajribam, ish turlari, muddat va boshqa muhim narsalarni yozing."
        />

        <fieldset className="fieldset">
          <legend className="label">Bog'lanish usullari</legend>
          <p className="hint">Kamida bittasini to'ldiring. Mijozlar shu orqali siz bilan bog'lanadi.</p>
          <Field
            id="phone"
            label="Telefon raqami"
            type="tel"
            optional
            value={form.phone}
            onChange={set("phone")}
            error={errors.phone}
            autoComplete="tel"
            placeholder="+998 90 123 45 67"
          />
          <Field
            id="instagram"
            label="Instagram username"
            optional
            value={form.instagram}
            onChange={set("instagram")}
            error={errors.instagram}
            autoCapitalize="none"
            placeholder="@username"
          />
          <Field
            id="telegram"
            label="Telegram username"
            optional
            value={form.telegram}
            onChange={set("telegram")}
            error={errors.telegram}
            autoCapitalize="none"
            placeholder="@username"
          />
          {errors.contacts && (
            <p className="error-text" role="alert">
              {errors.contacts}
            </p>
          )}
        </fieldset>

        <div className="ad-row__actions">
          <Button type="submit" size="lg">
            {editing ? "Saqlash" : "E'lonni joylash"}
          </Button>
          <Button to="/dashboard" variant="ghost" size="lg">
            Bekor qilish
          </Button>
        </div>
      </form>
    </div>
  )
}
