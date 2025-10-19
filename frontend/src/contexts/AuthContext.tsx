import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL  // for Vite
// or for Next.js: process.env.NEXT_PUBLIC_API_BASE_URL

type Role = 'student' | 'trainer'

interface User {
  id: string
  name: string
  email: string
  role: Role
  profile?: any
  stats?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`)
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password })
      const { token: jwtToken, user: userFromServer } = response.data

      if (jwtToken) {
        localStorage.setItem('token', jwtToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
        setToken(jwtToken)
      }

      setUser(userFromServer)

      return { success: true, user: userFromServer }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData)
      const { token: jwtToken, user: userFromServer } = response.data

      if (jwtToken) {
        localStorage.setItem('token', jwtToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
        setToken(jwtToken)
      }

      setUser(userFromServer)

      return { success: true, user: userFromServer }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (updates: any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile`, updates)
      setUser(response.data)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
