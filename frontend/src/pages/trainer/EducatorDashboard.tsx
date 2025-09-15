import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Home, Users, Calendar, DollarSign, User, Star, 
  Video, Globe, LogOut, Menu, X, Plus, Clock,
  MessageSquare, Award, BookOpen, Edit3
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

// Components for different sections
const TrainerHome = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: 5.0,
    totalStudents: 0,
    upcomingSessions: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, bookingsRes, userRes] = await Promise.all([
        axios.get('/api/sessions/my-sessions'),
        axios.get('/api/bookings/trainer-bookings'),
        axios.get('/api/auth/me')
      ])

      const sessions = sessionsRes.data
      const bookings = bookingsRes.data
      const userData = userRes.data

      setStats({
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        upcomingSessions: sessions.filter(s => s.status === 'scheduled').length,
        totalEarnings: userData.stats?.totalEarnings || 0,
        averageRating: userData.stats?.rating || 5.0,
        totalStudents: new Set(bookings.map(b => b.student._id)).size
      })

      setRecentBookings(bookings.slice(0, 5))
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, Trainer!</h2>
        <p className="text-gray-600 text-lg">Manage your sessions and track your progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
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
            <DollarSign className="h-6 w-6 text-gray-700" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</div>
          <div className="text-gray-600">Total Earnings</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
          <div className="text-gray-600">Students</div>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-soft-green to-cream rounded-xl flex items-center justify-center mx-auto mb-4">
            <Award className="h-6 w-6 text-gray-700" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
          <div className="text-gray-600">Rating</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="glass-effect rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recent Bookings</h3>
          <Link to="/trainer/students" className="text-accent hover:text-accent-dark font-medium">
            View All Students
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="p-4 bg-white bg-opacity-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{booking.studentName}</div>
                    <div className="text-gray-600">${booking.amount} • {new Date(booking.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bookings yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

const TrainerSessions = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

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

  const updateSessionStatus = async (sessionId, status) => {
    try {
      await axios.put(`/api/sessions/${sessionId}/status`, { status })
      fetchSessions() // Refresh sessions
    } catch (error) {
      console.error('Failed to update session status:', error)
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Sessions</h2>
          <Link to="/trainer/students" className="btn-primary">
            Create New Session
          </Link>
        </div>
        
        {sessions.length > 0 ? (
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session._id} className="p-6 bg-white bg-opacity-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{session.title}</h3>
                    <p className="text-gray-600">
                      {session.students?.length} student(s) • {session.duration} minutes
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.scheduledDate).toLocaleDateString()} at {new Date(session.scheduledDate).toLocaleTimeString()}
                    </p>
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
                    <div className="flex space-x-2">
                      {session.status === 'scheduled' && (
                        <button
                          onClick={() => updateSessionStatus(session._id, 'active')}
                          className="btn-primary btn-sm"
                        >
                          Start Session
                        </button>
                      )}
                      {session.status === 'active' && (
                        <>
                          <a
                            href={session.jitsiLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary btn-sm flex items-center"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join
                          </a>
                          <button
                            onClick={() => updateSessionStatus(session._id, 'completed')}
                            className="btn-secondary btn-sm"
                          >
                            End Session
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {session.description && (
                  <p className="text-gray-600 mb-4">{session.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
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
                  <div>
                    Jitsi Room: {session.jitsiRoomName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600 mb-6">Create your first session with your students</p>
            <Link to="/trainer/students" className="btn-primary">
              View Students
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

const TrainerStudents = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBookings, setSelectedBookings] = useState([])
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    duration: 60,
    language: '',
    level: 'beginner',
    scheduledDate: '',
    scheduledTime: ''
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/trainer-bookings')
      setBookings(response.data.filter(b => b.paymentStatus === 'completed'))
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = async (e) => {
    e.preventDefault()
    if (selectedBookings.length === 0) {
      alert('Please select at least one student')
      return
    }

    try {
      const scheduledDateTime = new Date(`${sessionData.scheduledDate}T${sessionData.scheduledTime}`)
      
      await axios.post('/api/sessions', {
        ...sessionData,
        bookingIds: selectedBookings,
        scheduledDate: scheduledDateTime.toISOString()
      })

      setShowCreateModal(false)
      setSelectedBookings([])
      setSessionData({
        title: '',
        description: '',
        duration: 60,
        language: '',
        level: 'beginner',
        scheduledDate: '',
        scheduledTime: ''
      })
      fetchBookings() // Refresh bookings
    } catch (error) {
      console.error('Failed to create session:', error)
      alert('Failed to create session')
    }
  }

  const toggleBookingSelection = (bookingId) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Students</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Session
          </button>
        </div>
        
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-6 bg-white bg-opacity-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{booking.studentName}</div>
                      <div className="text-gray-600">{booking.student?.email}</div>
                      <div className="text-sm text-gray-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()} • ${booking.amount}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                      booking.sessionId ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.sessionId ? 'Session Created' : 'Awaiting Session'}
                    </div>
                    {!booking.sessionId && (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking._id)}
                          onChange={() => toggleBookingSelection(booking._id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">Select for session</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students yet</h3>
            <p className="text-gray-600">Students will appear here after they book sessions with you</p>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create New Session</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selected Students ({selectedBookings.length})
                </label>
                <div className="text-sm text-gray-600">
                  {selectedBookings.length === 0 
                    ? 'Please select students from the list above'
                    : `${selectedBookings.length} student(s) selected`
                  }
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Session Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={sessionData.title}
                    onChange={(e) => setSessionData({...sessionData, title: e.target.value})}
                    className="input-field"
                    placeholder="e.g., English Conversation Practice"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    id="duration"
                    value={sessionData.duration}
                    onChange={(e) => setSessionData({...sessionData, duration: parseInt(e.target.value)})}
                    className="input-field"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={sessionData.description}
                  onChange={(e) => setSessionData({...sessionData, description: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Describe what you'll cover in this session..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    id="language"
                    value={sessionData.language}
                    onChange={(e) => setSessionData({...sessionData, language: e.target.value})}
                    className="input-field"
                    placeholder="e.g., English, Spanish"
                  />
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-semibold text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    id="level"
                    value={sessionData.level}
                    onChange={(e) => setSessionData({...sessionData, level: e.target.value})}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Session Date
                  </label>
                  <input
                    type="date"
                    id="scheduledDate"
                    value={sessionData.scheduledDate}
                    onChange={(e) => setSessionData({...sessionData, scheduledDate: e.target.value})}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="scheduledTime" className="block text-sm font-semibold text-gray-700 mb-2">
                    Session Time
                  </label>
                  <input
                    type="time"
                    id="scheduledTime"
                    value={sessionData.scheduledTime}
                    onChange={(e) => setSessionData({...sessionData, scheduledTime: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedBookings.length === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const TrainerReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews/trainer-reviews')
      const reviewsData = response.data
      setReviews(reviewsData)

      // Calculate stats
      const totalReviews = reviewsData.length
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0

      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      reviewsData.forEach(review => {
        ratingDistribution[review.rating]++
      })

      setStats({
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution
      })
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
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
      {/* Review Stats */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-effect rounded-2xl p-8 shadow-xl text-center">
          <div className="text-5xl font-bold text-accent mb-2">{stats.averageRating}</div>
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-gray-600">Average Rating</div>
          <div className="text-sm text-gray-500 mt-2">{stats.totalReviews} total reviews</div>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-8 text-sm font-medium">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current mx-2" />
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{
                      width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{stats.ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="glass-effect rounded-2xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">All Reviews</h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="p-6 bg-white bg-opacity-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-soft-coral rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.studentName}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Reviews from students will appear here after completed sessions</p>
          </div>
        )}
      </div>
    </div>
  )
}

const TrainerProfile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profile: {
      bio: user?.profile?.bio || '',
      languages: user?.profile?.languages || [],
      trainerLanguages: user?.profile?.trainerLanguages || [],
      experience: user?.profile?.experience || 0,
      hourlyRate: user?.profile?.hourlyRate || 25,
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      specializations: user?.profile?.specializations || [],
      teachingStyle: user?.profile?.teachingStyle || 'Conversational',
      studentAge: user?.profile?.studentAge || [],
      demoVideo: user?.profile?.demoVideo || '',
      socialMedia: {
        instagram: user?.profile?.socialMedia?.instagram || '',
        youtube: user?.profile?.socialMedia?.youtube || '',
        linkedin: user?.profile?.socialMedia?.linkedin || ''
      }
    }
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('profile.socialMedia.')) {
      const socialField = name.split('.')[2]
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          socialMedia: {
            ...formData.profile.socialMedia,
            [socialField]: value
          }
        }
      })
    } else if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileField]: profileField === 'experience' || profileField === 'hourlyRate' 
            ? parseFloat(value) || 0 
            : value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        [field]: array
      }
    })
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
          <div className="flex items-center text-accent">
            <Edit3 className="h-5 w-5 mr-2" />
            Edit Mode
          </div>
        </div>
        
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
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

            <div className="mt-6">
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
                placeholder="Tell students about yourself, your teaching experience, and approach..."
              />
            </div>
          </div>

          {/* Teaching Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Teaching Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="profile.experience" className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="profile.experience"
                  name="profile.experience"
                  value={formData.profile.experience}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label htmlFor="profile.hourlyRate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="profile.hourlyRate"
                  name="profile.hourlyRate"
                  value={formData.profile.hourlyRate}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  step="1"
                />
              </div>

              <div>
                <label htmlFor="profile.teachingStyle" className="block text-sm font-semibold text-gray-700 mb-2">
                  Teaching Style
                </label>
                <select
                  id="profile.teachingStyle"
                  name="profile.teachingStyle"
                  value={formData.profile.teachingStyle}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Conversational">Conversational</option>
                  <option value="Grammar-focused">Grammar-focused</option>
                  <option value="Immersive">Immersive</option>
                  <option value="Business-oriented">Business-oriented</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                </select>
              </div>

              <div>
                <label htmlFor="languages" className="block text-sm font-semibold text-gray-700 mb-2">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  id="languages"
                  value={formData.profile.languages.join(', ')}
                  onChange={(e) => handleArrayChange('languages', e.target.value)}
                  className="input-field"
                  placeholder="English, Spanish, French"
                />
              </div>

              <div>
                <label htmlFor="specializations" className="block text-sm font-semibold text-gray-700 mb-2">
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  id="specializations"
                  value={formData.profile.specializations.join(', ')}
                  onChange={(e) => handleArrayChange('specializations', e.target.value)}
                  className="input-field"
                  placeholder="Business English, IELTS Prep, Conversation"
                />
              </div>

              <div>
                <label htmlFor="studentAge" className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Age Groups (comma-separated)
                </label>
                <input
                  type="text"
                  id="studentAge"
                  value={formData.profile.studentAge.join(', ')}
                  onChange={(e) => handleArrayChange('studentAge', e.target.value)}
                  className="input-field"
                  placeholder="Kids, Teens, Adults"
                />
              </div>
            </div>
          </div>

          {/* Media & Social */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Media & Social Links</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="profile.demoVideo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Demo Video URL (YouTube)
                </label>
                <input
                  type="url"
                  id="profile.demoVideo"
                  name="profile.demoVideo"
                  value={formData.profile.demoVideo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label htmlFor="profile.socialMedia.instagram" className="block text-sm font-semibold text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="profile.socialMedia.instagram"
                  name="profile.socialMedia.instagram"
                  value={formData.profile.socialMedia.instagram}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label htmlFor="profile.socialMedia.youtube" className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  id="profile.socialMedia.youtube"
                  name="profile.socialMedia.youtube"
                  value={formData.profile.socialMedia.youtube}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://youtube.com/channel/..."
                />
              </div>

              <div>
                <label htmlFor="profile.socialMedia.linkedin" className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  id="profile.socialMedia.linkedin"
                  name="profile.socialMedia.linkedin"
                  value={formData.profile.socialMedia.linkedin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
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

const EducatorDashboard = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/trainer', icon: Home },
    { name: 'Sessions', href: '/trainer/sessions', icon: Calendar },
    { name: 'Students', href: '/trainer/students', icon: Users },
    { name: 'Reviews', href: '/trainer/reviews', icon: Star },
    { name: 'Profile', href: '/trainer/profile', icon: User },
  ]

  const isActive = (path) => {
    if (path === '/trainer') {
      return location.pathname === '/trainer' || location.pathname === '/trainer/'
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
              <div className="text-sm text-gray-600">Trainer</div>
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
              <div className="text-sm text-gray-600">
                Rating: <span className="font-semibold text-accent">{user?.stats?.rating || 5.0}</span>
              </div>
              <div className="text-sm text-gray-600">
                Earnings: <span className="font-semibold text-accent">${user?.stats?.totalEarnings || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<TrainerHome />} />
            <Route path="/sessions" element={<TrainerSessions />} />
            <Route path="/students" element={<TrainerStudents />} />
            <Route path="/reviews" element={<TrainerReviews />} />
            <Route path="/profile" element={<TrainerProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default EducatorDashboard