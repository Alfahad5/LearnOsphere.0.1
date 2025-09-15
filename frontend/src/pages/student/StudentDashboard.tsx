import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Home, BookOpen, User, Calendar, Star, Clock, 
  Video, Globe, LogOut, Menu, X, MessageSquare 
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

// Components for different sections
const StudentHome = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalSpent: 0
  })
  const [recentSessions, setRecentSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, bookingsRes] = await Promise.all([
        axios.get('/api/sessions/my-sessions'),
        axios.get('/api/bookings/my-bookings')
      ])

      const sessions = sessionsRes.data
      const bookings = bookingsRes.data

      setStats({
        totalSessions: sessions.length,
        upcomingSessions: sessions.filter(s => s.status === 'scheduled').length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        totalSpent: bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
      })

      setRecentSessions(sessions.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-effect rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back!</h2>
        <p className="text-gray-600 text-lg">Continue your language learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 shadow-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
          <div className="text-gray-600">Total Sessions</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-soft-green to-cream rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-gray-700" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</div>
          <div className="text-gray-600">Upcoming</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-soft-coral to-cream rounded-xl flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-gray-700" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.completedSessions}</div>
          <div className="text-gray-600">Completed</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-cream to-soft-green rounded-xl flex items-center justify-center mx-auto mb-4">
            <Globe className="h-6 w-6 text-gray-700" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalSpent}</div>
          <div className="text-gray-600">Total Spent</div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="glass-effect rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recent Sessions</h3>
          <Link to="/student/sessions" className="text-accent hover:text-accent-dark font-medium">
            View All
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session._id} className="p-4 bg-white bg-opacity-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{session.title}</div>
                    <div className="text-gray-600">with {session.trainer?.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No sessions yet</p>
            <Link to="/main" className="btn-primary mt-4 inline-block">
              Book Your First Session
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

const StudentSessions = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions/my-sessions')
      setSessions(response.data)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/reviews', {
        sessionId: selectedSession._id,
        trainerId: selectedSession.trainer._id,
        bookingId: selectedSession.bookings[0]?._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      
      setShowReviewModal(false)
      setReviewData({ rating: 5, comment: '' })
      fetchSessions() // Refresh sessions
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    <div className="space-y-8">
      <div className="glass-effect rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Sessions</h2>
        
        {sessions.length > 0 ? (
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session._id} className="p-6 bg-white bg-opacity-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-4">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{session.title}</h3>
                      <p className="text-gray-600">with {session.trainer?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.scheduledDate).toLocaleDateString()} at {new Date(session.scheduledDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium mb-2 ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      session.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </div>
                    {session.status === 'scheduled' || session.status === 'active' ? (
                      <a
                        href={session.jitsiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary btn-sm flex items-center"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Session
                      </a>
                    ) : session.status === 'completed' ? (
                      <button
                        onClick={() => {
                          setSelectedSession(session)
                          setShowReviewModal(true)
                        }}
                        className="btn-secondary btn-sm flex items-center"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Leave Review
                      </button>
                    ) : null}
                  </div>
                </div>
                
                {session.description && (
                  <p className="text-gray-600 mb-4">{session.description}</p>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: {session.duration} minutes
                  {session.language && (
                    <>
                      <span className="mx-2">•</span>
                      Language: {session.language}
                    </>
                  )}
                  {session.level && (
                    <>
                      <span className="mx-2">•</span>
                      Level: {session.level}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-6">Book your first session to get started</p>
            <Link to="/main" className="btn-primary">
              Browse Trainers
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Leave a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`p-2 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300"
                  rows="4"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const StudentProfile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profile: {
      bio: user?.profile?.bio || '',
      languages: user?.profile?.languages || [],
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileField]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await updateProfile(formData)
    
    if (result.success) {
      setSuccess('Profile updated successfully!')
    } else {
      setError(result.error || 'Failed to update profile')
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h2>
        
        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                disabled
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile.bio" className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="profile.bio"
              name="profile.bio"
              value={formData.profile.bio}
              onChange={handleChange}
              className="input-field"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="profile.phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="profile.phone"
                name="profile.phone"
                value={formData.profile.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="profile.location" className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="profile.location"
                name="profile.location"
                value={formData.profile.location}
                onChange={handleChange}
                className="input-field"
                placeholder="City, Country"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/student', icon: Home },
    { name: 'My Sessions', href: '/student/sessions', icon: Calendar },
    { name: 'My Profile', href: '/student/profile', icon: User },
  ]

  const isActive = (path) => {
    if (path === '/student') {
      return location.pathname === '/student' || location.pathname === '/student/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white bg-opacity-90 backdrop-blur-lg border-r border-white border-opacity-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-white border-opacity-30">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">LinguaConnect</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{user?.name}</div>
              <div className="text-sm text-gray-600">Student</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white border-opacity-30">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg border-b border-white border-opacity-30 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <Link to="/main" className="btn-secondary btn-sm">
                Browse Trainers
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/sessions" element={<StudentSessions />} />
            <Route path="/profile" element={<StudentProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard