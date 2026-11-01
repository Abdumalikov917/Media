import RegisterForm from "../components/RegisterForm"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

export default function ClientRegister() {
  useDocumentTitle("Mijoz sifatida ro'yxatdan o'tish")

  return (
    <div className="container">
      <RegisterForm
        role="client"
        title="Mijoz akkaunti"
        lead="Mediachilarning e'lonlarini ko'ring va ular bilan chatda bog'laning."
        submitLabel="Ro'yxatdan o'tish"
      />
    </div>
  )
}
