import RegisterForm from "../components/RegisterForm"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

export default function MediaRegister() {
  useDocumentTitle("Mediachi sifatida ro'yxatdan o'tish")

  return (
    <div className="container">
      <RegisterForm
        role="media"
        title="Mediachi akkaunti"
        lead="E'lon bering: nimalar qila olishingizni yozing va mijozlar siz bilan bog'lansin."
        submitLabel="Ro'yxatdan o'tish"
      />
    </div>
  )
}
