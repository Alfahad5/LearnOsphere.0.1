import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import '../theme.css' // ensure theme is imported (or import once in index.tsx)

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const extractUserObject = (result: any) => {
    if (!result || typeof result !== 'object') return null

    // Common shapes:
    // { user: {...}, success: true }
    // { data: { user: {...} } }
    // { data: {...userProps...} }
    // { user: {...} } or directly user object
    if ('user' in result && result.user) return result.user
    if ('data' in result) {
      if (result.data?.user) return result.data.user
      // if data itself looks like a user object
      return result.data
    }
    // fallback when login returns the user directly
    return result
  }

  const getRoleFromObject = (userObj: any) => {
    if (!userObj) return ''
    // role could be in different keys or nested
    return (
      userObj.role ??
      userObj.roleName ??
      userObj?.user?.role ??
      // roles array case
      (Array.isArray(userObj.roles) && userObj.roles[0]) ??
      ''
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password)

      // pull user object from many shapes
      const userObj = extractUserObject(result)
      const roleRaw = getRoleFromObject(userObj)
      const role = (roleRaw ?? '').toString().toLowerCase()

      // treat success when backend returns success flag OR we could parse a user object
      const isSuccess = result?.success === true || !!userObj

      if (isSuccess) {
        // route by role (flexible checks)
        if (role.includes('student')) {
          navigate('/main', { replace: true })
        } else if (role.includes('trainer') || role.includes('educator')) {
          // navigates to /trainer which matches your /trainer/* route
          navigate('/trainer/', { replace: true })
        } else {
          // fallback to main
          navigate('/main', { replace: true })
        }
      } else {
        // fallback error message handling
        const message =
          (result && (result.error || (result as any).message)) ||
          'Login failed. Please check credentials.'
        setError(message)
      }
    } catch (err: any) {
      console.error('Login error', err)
      setError(err?.response?.data?.message || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-pale flex items-center justify-center py-12"
      style={{
        background: `linear-gradient(180deg,var(--bg-pale-top),var(--bg-pale-bottom))`,
      }}
    >
      {/* Decorative subtle orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full"
          style={{
            background: 'var(--brand-teal)',
            opacity: 0.06,
            animation: 'floaty 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-44 right-16 w-24 h-24 rounded-full"
          style={{
            background: 'var(--teal-mid)',
            opacity: 0.06,
            animation: 'floaty 6s ease-in-out infinite',
            animationDelay: '1.8s',
          }}
        />
        <div
          className="absolute bottom-24 left-1/4 w-40 h-40 rounded-full"
          style={{
            background: 'var(--accent-orange)',
            opacity: 0.04,
            animation: 'floaty 6s ease-in-out infinite',
            animationDelay: '3.2s',
          }}
        />
      </div>

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to continue your language learning journey</p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <div className="flex items-center gap-2">⚠️ <span>{error}</span></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-3"
              aria-disabled={loading}
            >
              {loading ? (
                <div className="loading-dots" aria-hidden>
                  <div></div><div></div><div></div><div></div>
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
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold" style={{ color: 'var(--brand-teal)' }}>
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
