import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  User, Star, Globe, Clock, Award, MapPin, Calendar, 
  Play, Instagram, Youtube, Linkedin, ArrowLeft, BookOpen,
  CheckCircle, Video, MessageSquare
} from 'lucide-react'
import axios from 'axios'

interface Trainer {
  _id: string
  name: string
  email: string
  profile: {
    bio: string
    languages: string[]
    trainerLanguages: Array<{
      language: string
      proficiency: string
      teachingLevel: string[]
    }>
    experience: number
    hourlyRate: number
    avatar: string
    phone: string
    location: string
    specializations: string[]
    certifications: Array<{
      name: string
      issuer: string
      year: number
    }>
    availability: Array<{
      day: string
      startTime: string
      endTime: string
      available: boolean
    }>
    demoVideo: string
    socialMedia: {
      instagram: string
      youtube: string
      linkedin: string
    }
    teachingStyle: string
    studentAge: string[]
    isAvailable: boolean
    totalBookings: number
    averageRating: number
  }
  stats: {
    rating: number
    totalSessions: number
    completedSessions: number
  }
}

interface Review {
  _id: string
  rating: number
  comment: string
  studentName: string
  createdAt: string
}

const TrainerProfile = () => {
  const { trainerId } = useParams()
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (trainerId) {
      fetchTrainerProfile()
      fetchReviews()
    }
  }, [trainerId])

  const fetchTrainerProfile = async () => {
    try {
      const response = await axios.get(`/api/users/profile/${trainerId}`)
      setTrainer(response.data)
    } catch (error) {
      console.error('Failed to fetch trainer profile:', error)
      setError('Failed to load trainer profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/trainer/${trainerId}`)
      setReviews(response.data)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return ''
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`
    }
    
    return url.includes('embed') ? url : ''
  }

  const formatAvailability = () => {
    if (!trainer?.profile.availability) return []
    
    return trainer.profile.availability
      .filter(slot => slot.available)
      .map(slot => ({
        day: slot.day.charAt(0).toUpperCase() + slot.day.slice(1),
        time: `${slot.startTime} - ${slot.endTime}`
      }))
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

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Trainer not found</h2>
          <Link to="/main" className="btn-primary">
            Browse Trainers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-lg border-b border-white border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-soft-coral rounded-xl flex items-center justify-center mr-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">LinguaConnect</span>
            </Link>
            
            <Link
              to="/main"
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Trainers
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="glass-effect rounded-2xl p-8 shadow-xl animate-slide-up">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent to-soft-coral rounded-2xl flex items-center justify-center mr-6">
                    {trainer.profile.avatar ? (
                      <img
                        src={trainer.profile.avatar}
                        alt={trainer.name}
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{trainer.name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="font-semibold text-lg">{trainer.stats.rating || trainer.profile.averageRating || 5.0}</span>
                      <span className="ml-2">({reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{trainer.profile.location || 'Online'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent mb-2">
                    ${trainer.profile.hourlyRate}/hr
                  </div>
                  <Link
                    to={`/book/${trainer._id}`}
                    className="btn-primary"
                  >
                    Book Session
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-white bg-opacity-50 rounded-xl">
                  <div className="text-2xl font-bold text-accent">{trainer.profile.experience}+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-white bg-opacity-50 rounded-xl">
                  <div className="text-2xl font-bold text-accent">{trainer.stats.completedSessions || 0}</div>
                  <div className="text-gray-600">Sessions Completed</div>
                </div>
                <div className="text-center p-4 bg-white bg-opacity-50 rounded-xl">
                  <div className="text-2xl font-bold text-accent">{trainer.profile.totalBookings || 0}</div>
                  <div className="text-gray-600">Students Taught</div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
                <p className="text-gray-600 leading-relaxed">
                  {trainer.profile.bio || 'Experienced language trainer helping students achieve fluency through personalized lessons and engaging conversations.'}
                </p>
              </div>
            </div>

            {/* Languages */}
            <div className="glass-effect rounded-2xl p-8 shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="h-6 w-6 mr-3 text-accent" />
                Languages I Teach
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {trainer.profile.trainerLanguages.length > 0 ? (
                  trainer.profile.trainerLanguages.map((lang, index) => (
                    <div key={index} className="p-4 bg-white bg-opacity-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-900">{lang.language}</h4>
                        <span className="px-3 py-1 bg-accent text-white rounded-full text-sm">
                          {lang.proficiency}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lang.teachingLevel.map((level, idx) => (
                          <span key={idx} className="px-2 py-1 bg-soft-green text-gray-700 rounded-lg text-sm">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  trainer.profile.languages.map((language, index) => (
                    <div key={index} className="p-4 bg-white bg-opacity-50 rounded-xl">
                      <h4 className="font-bold text-gray-900">{language}</h4>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Specializations */}
            {trainer.profile.specializations.length > 0 && (
              <div className="glass-effect rounded-2xl p-8 shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="h-6 w-6 mr-3 text-accent" />
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-3">
                  {trainer.profile.specializations.map((spec, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-soft-green to-cream text-gray-800 rounded-full font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Demo Video */}
            {trainer.profile.demoVideo && (
              <div className="glass-effect rounded-2xl p-8 shadow-xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Play className="h-6 w-6 mr-3 text-accent" />
                  Demo Video
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(trainer.profile.demoVideo)}
                    title="Trainer Demo Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="glass-effect rounded-2xl p-8 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-accent" />
                Student Reviews ({reviews.length})
              </h3>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.slice(0, 5).map((review) => (
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
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Certifications */}
            {trainer.profile.certifications.length > 0 && (
              <div className="glass-effect rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-accent" />
                  Certifications
                </h3>
                <div className="space-y-4">
                  {trainer.profile.certifications.map((cert, index) => (
                    <div key={index} className="p-4 bg-white bg-opacity-50 rounded-xl">
                      <div className="font-semibold text-gray-900">{cert.name}</div>
                      {cert.issuer && <div className="text-sm text-gray-600">{cert.issuer}</div>}
                      {cert.year && <div className="text-sm text-gray-600">{cert.year}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-accent" />
                Availability
              </h3>
              <div className="space-y-3">
                {formatAvailability().length > 0 ? (
                  formatAvailability().map((slot, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white bg-opacity-50 rounded-lg">
                      <span className="font-medium text-gray-900">{slot.day}</span>
                      <span className="text-gray-600">{slot.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Available by appointment</p>
                )}
              </div>
            </div>

            {/* Contact & Social */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect</h3>
              <div className="space-y-4">
                {trainer.profile.socialMedia.instagram && (
                  <a
                    href={trainer.profile.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-300"
                  >
                    <Instagram className="h-5 w-5 text-pink-500 mr-3" />
                    <span className="text-gray-700">Instagram</span>
                  </a>
                )}
                {trainer.profile.socialMedia.youtube && (
                  <a
                    href={trainer.profile.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-300"
                  >
                    <Youtube className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-700">YouTube</span>
                  </a>
                )}
                {trainer.profile.socialMedia.linkedin && (
                  <a
                    href={trainer.profile.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-300"
                  >
                    <Linkedin className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* Teaching Info */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Teaching Style</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white bg-opacity-50 rounded-lg">
                  <div className="font-medium text-gray-900">Style</div>
                  <div className="text-gray-600">{trainer.profile.teachingStyle}</div>
                </div>
                {trainer.profile.studentAge.length > 0 && (
                  <div className="p-3 bg-white bg-opacity-50 rounded-lg">
                    <div className="font-medium text-gray-900">Student Age Groups</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {trainer.profile.studentAge.map((age, index) => (
                        <span key={index} className="px-2 py-1 bg-soft-green text-gray-700 rounded-lg text-sm">
                          {age}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainerProfile