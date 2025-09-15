import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Star, Globe, Clock, Award, User, MapPin, DollarSign, ChevronDown, X } from 'lucide-react'
import axios from 'axios'

/** Safer Trainer types: make many nested fields optional because remote data can be incomplete */
interface Trainer {
  _id: string
  name?: string
  email?: string
  profile?: {
    bio?: string
    languages?: string[]
    trainerLanguages?: Array<{
      language?: string
      proficiency?: string
      teachingLevel?: string[]
    }>
    experience?: number
    hourlyRate?: number
    avatar?: string
    location?: string
    specializations?: string[]
    isAvailable?: boolean
    averageRating?: number
    totalBookings?: number
  }
  stats?: {
    rating?: number
    totalSessions?: number
  }
}

const MainPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    language: '',
    minRate: '',
    maxRate: '',
    experience: '',
    specialization: '',
    rating: '',
    sortBy: 'rating'
  })

  useEffect(() => {
    fetchTrainers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recompute filtered list whenever trainers / searchTerm / filters change
  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainers, searchTerm, filters])

  const fetchTrainers = async () => {
    try {
      const response = await axios.get('/api/users/trainers')
      // Ensure we always have an array
      const data = Array.isArray(response.data) ? response.data : []
      setTrainers(data)
    } catch (error) {
      console.error('Failed to fetch trainers:', error)
      setTrainers([])
    } finally {
      setLoading(false)
    }
  }

  // helper: safely get numeric rating (prefer stats.rating, then profile.averageRating)
  const getRating = (t: Trainer): number => {
    const s = t?.stats?.rating
    const p = t?.profile?.averageRating
    const rv = typeof s === 'number' && !Number.isNaN(s) ? s : (typeof p === 'number' && !Number.isNaN(p) ? p : 0)
    return rv
  }

  // helper: safe numeric parse
  const parseNumber = (val: string | number | undefined, fallback = 0) => {
    if (val === undefined || val === null || val === '') return fallback
    const n = Number(val)
    return Number.isFinite(n) ? n : fallback
  }

  const applyFilters = () => {
    try {
      // defensive copy + sanitize (remove null/undefined)
      let filtered = (Array.isArray(trainers) ? trainers.slice() : []).filter(Boolean) as Trainer[]

      // Normalize searchTerm to lower for comparisons
      const q = (searchTerm || '').trim().toLowerCase()

      // Search filter
      if (q) {
        filtered = filtered.filter(trainer => {
          // guard trainer object
          if (!trainer) return false

          const name = (trainer.name || '').toLowerCase()
          const bio = (trainer.profile?.bio || '').toLowerCase()
          const languages = Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.map(l => (l || '').toLowerCase()) : []
          const trainerLangs = Array.isArray(trainer.profile?.trainerLanguages)
            ? trainer.profile!.trainerLanguages!.map(tl => (tl.language || '').toLowerCase())
            : []
          const specializations = Array.isArray(trainer.profile?.specializations) ? trainer.profile!.specializations!.map(s => (s || '').toLowerCase()) : []

          return (
            name.includes(q) ||
            bio.includes(q) ||
            languages.some(lang => lang.includes(q)) ||
            trainerLangs.some(lang => lang.includes(q)) ||
            specializations.some(spec => spec.includes(q))
          )
        })
      }

      // Language filter
      if (filters.language && filters.language.trim() !== '') {
        const langQ = filters.language.trim().toLowerCase()
        filtered = filtered.filter(trainer => {
          const langs = Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.map(l => (l || '').toLowerCase()) : []
          const tlangs = Array.isArray(trainer.profile?.trainerLanguages) ? trainer.profile!.trainerLanguages!.map(tl => (tl.language || '').toLowerCase()) : []
          return langs.some(l => l.includes(langQ)) || tlangs.some(l => l.includes(langQ))
        })
      }

      // Price range
      if (filters.minRate !== '') {
        const min = parseNumber(filters.minRate, 0)
        filtered = filtered.filter(trainer => parseNumber(trainer.profile?.hourlyRate, 0) >= min)
      }
      if (filters.maxRate !== '') {
        const max = parseNumber(filters.maxRate, Infinity)
        filtered = filtered.filter(trainer => parseNumber(trainer.profile?.hourlyRate, 0) <= max)
      }

      // Experience filter
      if (filters.experience !== '') {
        const minExp = parseNumber(filters.experience, 0)
        filtered = filtered.filter(trainer => parseNumber(trainer.profile?.experience, 0) >= minExp)
      }

      // Specialization filter
      if (filters.specialization && filters.specialization.trim() !== '') {
        const specQ = filters.specialization.trim().toLowerCase()
        filtered = filtered.filter(trainer => {
          const specs = Array.isArray(trainer.profile?.specializations) ? trainer.profile!.specializations!.map(s => (s || '').toLowerCase()) : []
          return specs.some(s => s.includes(specQ))
        })
      }

      // Rating filter (min)
      if (filters.rating !== '') {
        const minRating = parseNumber(filters.rating, 0)
        filtered = filtered.filter(trainer => getRating(trainer) >= minRating)
      }

      // Sorting — non-mutating approach: make a shallow copy and sort that
      const sorted = filtered.slice()
      switch (filters.sortBy) {
        case 'rating':
          sorted.sort((a, b) => getRating(b) - getRating(a))
          break
        case 'price_low':
          sorted.sort((a, b) => parseNumber(a.profile?.hourlyRate, 0) - parseNumber(b.profile?.hourlyRate, 0))
          break
        case 'price_high':
          sorted.sort((a, b) => parseNumber(b.profile?.hourlyRate, 0) - parseNumber(a.profile?.hourlyRate, 0))
          break
        case 'experience':
          sorted.sort((a, b) => parseNumber(b.profile?.experience, 0) - parseNumber(a.profile?.experience, 0))
          break
        default:
          break
      }

      setFilteredTrainers(sorted)
    } catch (err) {
      console.error('applyFilters error', err)
      setFilteredTrainers([])
    }
  }

  const clearFilters = () => {
    setFilters({
      language: '',
      minRate: '',
      maxRate: '',
      experience: '',
      specialization: '',
      rating: '',
      sortBy: 'rating'
    })
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral flex items-center justify-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent opacity-10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-soft-green opacity-20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-soft-coral opacity-10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white bg-opacity-90 backdrop-blur-lg border-b border-white border-opacity-30 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-3 transform hover:scale-110 transition-transform duration-300">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">LinguaConnect</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link to="/login" className="text-gray-700 hover:text-accent transition-colors duration-300 font-medium">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Find Your Perfect
            <span className="block text-gradient animate-pulse-slow">Language Trainer</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with expert language trainers from around the world. Start your journey to fluency today.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl p-8 mb-12 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search trainers by name, language, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 text-lg"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-6 py-4 bg-accent text-white rounded-xl hover:bg-accent-dark transition-all duration-300 font-semibold"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`h-5 w-5 ml-2 transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl animate-slide-down">
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                  <input
                    type="text"
                    placeholder="e.g., English, Spanish"
                    value={filters.language}
                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price ($/hr)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minRate}
                    onChange={(e) => setFilters({...filters, minRate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price ($/hr)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={filters.maxRate}
                    onChange={(e) => setFilters({...filters, maxRate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Experience (years)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.experience}
                    onChange={(e) => setFilters({...filters, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g., Business, Exam Prep"
                    value={filters.specialization}
                    onChange={(e) => setFilters({...filters, specialization: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({...filters, rating: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="experience">Most Experienced</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-lg text-gray-600">
            Found <span className="font-bold text-accent">{filteredTrainers.length}</span> trainers
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrainers.map((trainer, index) => {
            const id = trainer._id || `trainer-${index}`
            const avatar = trainer.profile?.avatar
            const rating = getRating(trainer) || 0
            const reviews = parseNumber(trainer.profile?.totalBookings, 0)

            // languages fallback
            const languagesList = (Array.isArray(trainer.profile?.trainerLanguages) && trainer.profile!.trainerLanguages!.length > 0)
              ? trainer.profile!.trainerLanguages!.slice(0, 3).map(tl => tl.language || '')
              : (Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.slice(0, 3) : [])

            return (
              <div
                key={id}
                className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Trainer Avatar */}
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-soft-coral rounded-2xl flex items-center justify-center mr-4 overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={trainer.name || 'Trainer'}
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{trainer.name || 'Unnamed Trainer'}</h3>
                    <div className="flex items-center text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                      <span className="ml-2">({reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {languagesList.map((language, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-soft-green to-cream text-gray-800 rounded-full text-sm font-medium"
                      >
                        {language || '—'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {trainer.profile?.bio || 'Experienced language trainer helping students achieve fluency through personalized lessons.'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-accent" />
                    <span className="text-sm">{parseNumber(trainer.profile?.experience, 5)}+ years</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-accent" />
                    <span className="text-sm">{trainer.profile?.location || 'Online'}</span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-accent">
                    ${parseNumber(trainer.profile?.hourlyRate, 25)}/hr
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/trainer-profile/${trainer._id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/book/${trainer._id}`}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors duration-300 font-medium"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredTrainers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No trainers found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainPage
