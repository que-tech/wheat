import React, { createContext, useState, useEffect, useContext } from 'react'
import { verifyToken } from '../lib/auth'

interface User {
  id: string
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      const userData = verifyToken(token)
      if (userData) {
        setUser(userData as User)
      } else {
        localStorage.removeItem('authToken')
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
