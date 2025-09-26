import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, GraduationCap, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import '../theme.css'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [searchParams] = useSearchParams()
  const defaultRole = (searchParams.get('role') || 'student') as string

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    })

    if (result?.success) {
      if (formData.role === 'student') navigate('/student')
      else navigate('/trainer')
    } else {
      setError(result?.error || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen bg-pale flex items-center justify-center py-12"
      style={{
        background: `linear-gradient(180deg,var(--bg-pale-top),var(--bg-pale-bottom))`,
      }}
    >
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
          className="absolute top-44 right-20 w-24 h-24 rounded-full"
          style={{
            background: 'var(--teal-mid)',
            opacity: 0.06,
            animation: 'floaty 6s ease-in-out infinite',
            animationDelay: '1.8s',
          }}
        />
      </div>

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Join HIREGENIUS
          </h1>
          <p className="text-slate-600">
            Start your language learning journey today
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <div className="flex items-center gap-2">
                ⚠️ <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                    formData.role === 'student'
                      ? 'border-[var(--brand-teal)] bg-[rgba(14,165,163,0.06)]'
                      : 'border-gray-200 hover:border-[var(--brand-teal)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <BookOpen className="h-6 w-6 text-[var(--brand-teal)] mr-3" />
                  <div>
                    <div className="font-semibold text-slate-900">Student</div>
                    <div className="text-sm text-slate-600">Learn languages</div>
                  </div>
                </label>

                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                    formData.role === 'trainer'
                      ? 'border-[var(--brand-teal)] bg-[rgba(14,165,163,0.06)]'
                      : 'border-gray-200 hover:border-[var(--brand-teal)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="trainer"
                    checked={formData.role === 'trainer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <GraduationCap className="h-6 w-6 text-[var(--brand-teal)] mr-3" />
                  <div>
                    <div className="font-semibold text-slate-900">Trainer</div>
                    <div className="text-sm text-slate-600">Teach languages</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-all duration-300"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-all duration-300"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(s => !s)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-3"
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
                  Create Account <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold"
                style={{ color: 'var(--brand-teal)' }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
