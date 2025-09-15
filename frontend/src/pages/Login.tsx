import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Globe, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password)

      // Normalise where the role might be located in the response
      // support shapes like:
      // { success: true, user: { role: 'student' } }
      // { success: true, role: 'trainer' }
      // { success: true, data: { user: { role: 'student' } } }
      // Type guard to check if result has a 'user' property
      const hasUser = (obj: any): obj is { user: any } => obj && typeof obj === 'object' && 'user' in obj
      const userObj = hasUser(result)
        ? result.user
        : (result && 'data' in result && hasUser((result as any).data))
        ? (result as any).data.user
        : (result && 'data' in result)
        ? (result as any).data
        : result
      const role = userObj?.role || userObj?.roleName || (userObj && userObj?.user?.role) || ''

      if (result?.success) {
        // decide destination by role
        const r = (role || '').toString().toLowerCase()

        if (r === 'student') {
          navigate('/student')
        } else if (r === 'trainer' || r === 'educator') {
          // accept both 'trainer' and 'educator' just in case backend uses either
          navigate('/trainer')
        } else {
          // fallback if role missing or unknown
          navigate('/main')
        }
      } else {
        // login returned success: false
        setError(result?.error || (result as any)?.message || 'Login failed')
      }
    } catch (err: any) {
      // network / unexpected error
      console.error('Login error', err)
      setError(err?.response?.data?.message || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent opacity-10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-soft-green opacity-20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-soft-coral opacity-10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full mx-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-soft-coral rounded-2xl flex items-center justify-center mr-4 transform hover:scale-110 transition-transform duration-300">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">LinguaConnect</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your language learning journey</p>
        </div>

        {/* Login Form */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-fade-scale">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-4"
            >
              {loading ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-dark font-semibold transition-colors duration-300">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
