import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Globe, ArrowRight, GraduationCap, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'student'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
      role: formData.role
    })
    
    if (result.success) {
      if (formData.role === 'student') {
        navigate('/student')
      } else {
        navigate('/trainer')
      }
    } else {
      setError(result.error || 'Registration failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral flex items-center justify-center py-12">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join LinguaConnect</h1>
          <p className="text-gray-600">Start your language learning journey today</p>
        </div>

        {/* Registration Form */}
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
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.role === 'student' 
                    ? 'border-accent bg-accent bg-opacity-10' 
                    : 'border-gray-200 hover:border-accent hover:bg-accent hover:bg-opacity-5'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <BookOpen className="h-6 w-6 text-accent mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">Student</div>
                    <div className="text-sm text-gray-600">Learn languages</div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  formData.role === 'trainer' 
                    ? 'border-accent bg-accent bg-opacity-10' 
                    : 'border-gray-200 hover:border-accent hover:bg-accent hover:bg-opacity-5'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="trainer"
                    checked={formData.role === 'trainer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <GraduationCap className="h-6 w-6 text-accent mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">Trainer</div>
                    <div className="text-sm text-gray-600">Teach languages</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-dark font-semibold transition-colors duration-300">
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