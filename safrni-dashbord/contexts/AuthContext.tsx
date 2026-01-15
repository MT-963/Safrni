'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, setAuthToken } from '@/services/api'
import { useRouter } from 'next/navigation'

interface User {
  sellerId: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isEmployee: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage on mount
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setAuthToken(token)
      setUser(JSON.parse(userData))
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)
      const { token, sellerId, name, role } = response.data

      const userData = { sellerId, name, email, role }

      // Save to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      // Set token in API headers
      setAuthToken(token)

      // Update state
      setUser(userData)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'فشل تسجيل الدخول'
      throw new Error(message)
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Clear token from API headers
    setAuthToken(null)

    // Clear state
    setUser(null)

    // Redirect to login
    router.push('/login')
  }

  const isAdmin = user?.role === 'Admin'
  const isEmployee = user?.role === 'Employee'
  const isAuthenticated = user !== null

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isEmployee,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

