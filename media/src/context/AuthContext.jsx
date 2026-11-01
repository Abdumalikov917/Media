import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import * as authService from "../services/authService"
import * as userService from "../services/userService"
import { subscribe, KEYS } from "../utils/storage"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())

  // Boshqa tabda kirish/chiqish yoki ism o'zgarsa, shu yerda ham yangilanadi.
  useEffect(() => subscribe([KEYS.session, KEYS.users], () => setUser(authService.getCurrentUser())), [])

  const register = useCallback(async (data) => {
    const created = await authService.register(data)
    setUser(created)
    return created
  }, [])

  const login = useCallback(async (credentials) => {
    const loggedIn = await authService.login(credentials)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const updateName = useCallback(
    (name) => {
      const updated = userService.updateName(user.id, name)
      setUser(updated)
      return updated
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, register, login, logout, updateName }),
    [user, register, login, logout, updateName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
