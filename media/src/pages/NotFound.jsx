import Button from "../components/Button"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

export default function NotFound() {
  useDocumentTitle("Sahifa topilmadi")

  return (
    <div className="container page">
      <div className="empty">
        <h3>Sahifa topilmadi</h3>
        <p>Havola noto'g'ri yoki sahifa o'chirilgan.</p>
        <Button to="/" size="sm">
          Bosh sahifaga qaytish
        </Button>
      </div>
    </div>
  )
}
