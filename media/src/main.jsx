import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import "./styles/variables.css"
import "./styles/global.css"
import "./styles/responsive.css"

// HashRouter: sayt istalgan hostingda (GitHub Pages ham) sahifani yangilaganda 404 bermaydi.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
