import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { User, Star, Clock, Globe, CreditCard, DollarSign, ArrowLeft, CheckCircle, Shield, Lock, Receipt } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S23EsEiAibFBvoAcRhsYQj1fNiqfWKTJqrMgHlf76AjyFOyM81AU3DSqgboUKpIdClQmcMIEhUMOtOeYiz4eX4v00JEPCpKeA')

const PaymentForm = ({ trainer, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [cardError, setCardError] = useState('')

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message)
    } else {
      setCardError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!studentName.trim()) {
      onPaymentError('Please enter your name')
      return
    }

    setLoading(true)

    try {
      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) {
          onPaymentError('Stripe not loaded')
          return
        }

        const cardElement = elements.getElement(CardElement)
        
        if (!cardElement) {
          onPaymentError('Card element not found')
          return
        }

        // Create payment intent
        const { data } = await axios.post('/api/payments/create-payment-intent', {
          amount: trainer.profile?.hourlyRate || 25,
          currency: 'usd'
        })

        // Confirm payment
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: studentName,
            },
          }
        })

        if (result.error) {
          onPaymentError(result.error.message)
        } else {
          // Create booking
          const bookingResponse = await axios.post('/api/bookings', {
            trainerId: trainer._id,
            studentName,
            paymentMethod: 'stripe',
            amount: trainer.profile?.hourlyRate || 25
          })

          // Update payment status
          await axios.put(`/api/bookings/${bookingResponse.data._id}/payment`, {
            paymentStatus: 'completed',
            paymentId: result.paymentIntent.id
          })

          onPaymentSuccess({
            ...bookingResponse.data,
            paymentDetails: {
              paymentId: result.paymentIntent.id,
              amount: result.paymentIntent.amount / 100,
              currency: result.paymentIntent.currency,
              status: result.paymentIntent.status
            }
          })
        }
      } else {
        // Fake payment
        const fakePaymentResponse = await axios.post('/api/payments/fake-payment', {
          amount: trainer.profile?.hourlyRate || 25
        })

        // Create booking
        const bookingResponse = await axios.post('/api/bookings', {
          trainerId: trainer._id,
          studentName,
          paymentMethod: 'fake',
          amount: trainer.profile?.hourlyRate || 25
        })

        // Update payment status
        await axios.put(`/api/bookings/${bookingResponse.data._id}/payment`, {
          paymentStatus: 'completed',
          paymentId: fakePaymentResponse.data.paymentId
        })

        onPaymentSuccess({
          ...bookingResponse.data,
          paymentDetails: {
            paymentId: fakePaymentResponse.data.paymentId,
            amount: trainer.profile?.hourlyRate || 25,
            currency: 'usd',
            status: 'succeeded'
          }
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
      onPaymentError(error.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-light to-cream-light p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-accent" />
          Secure Payment
        </h3>
        <p className="text-gray-600">Your payment information is encrypted and secure</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="studentName" className="block text-sm font-semibold text-gray-700 mb-3">
            Your Full Name *
          </label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="input-field"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Choose Payment Method
          </label>
          <div className="space-y-4">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-accent hover:bg-opacity-5 transition-all duration-300">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-accent focus:ring-accent border-gray-300"
              />
              <div className="ml-4 flex items-center">
                <CreditCard className="h-6 w-6 text-accent mr-3" />
                <div>
                  <span className="font-semibold text-gray-900">Credit/Debit Card</span>
                  <div className="text-sm text-gray-600">Secure payment via Stripe</div>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-6" />
                <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-6" />
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-accent hover:bg-opacity-5 transition-all duration-300">
              <input
                type="radio"
                name="paymentMethod"
                value="fake"
                checked={paymentMethod === 'fake'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-accent focus:ring-accent border-gray-300"
              />
              <div className="ml-4 flex items-center">
                <DollarSign className="h-6 w-6 text-green mr-3" />
                <div>
                  <span className="font-semibold text-gray-900">Demo Payment</span>
                  <div className="text-sm text-gray-600">For testing purposes only</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {paymentMethod === 'stripe' && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Card Details
            </label>
            <div className="p-4 border-2 border-gray-200 rounded-xl focus-within:border-accent transition-all duration-300">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                    invalid: {
                      color: '#EF4444',
                    },
                  },
                }}
                onChange={handleCardChange}
              />
            </div>
            {cardError && (
              <div className="text-red-500 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {cardError}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <Lock className="h-4 w-4 mr-2" />
              Your card information is encrypted and secure
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-accent to-coral-dark p-6 rounded-2xl text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-3xl font-bold">
              ${trainer.profile?.hourlyRate || 25}
            </span>
          </div>
          <div className="flex items-center text-sm opacity-90">
            <Receipt className="h-4 w-4 mr-2" />
            One-time payment for language learning session
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || (paymentMethod === 'stripe' && !stripe)}
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
              <CheckCircle className="h-6 w-6 mr-3" />
              {paymentMethod === 'stripe' 
                ? `Pay $${trainer.profile?.hourlyRate || 25} with Stripe` 
                : `Complete Demo Payment $${trainer.profile?.hourlyRate || 25}`
              }
            </>
          )}
        </button>
      </form>
    </div>
  )
}

const BookingPage = () => {
  const { trainerId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.role !== 'student') {
      navigate('/main')
      return
    }

    fetchTrainer()
  }, [trainerId, user, navigate])

  const fetchTrainer = async () => {
    try {
      const response = await axios.get(`/api/users/profile/${trainerId}`)
      setTrainer(response.data)
    } catch (error) {
      setError('Failed to load trainer information')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (bookingData) => {
    setBooking(bookingData)
    setSuccess(true)
    setError('')
  }

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-light to-cream-light">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-light to-cream-light">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Trainer not found</h2>
          <Link to="/main" className="btn-primary">
            Browse Trainers
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-light to-cream-light flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="card text-center animate-fade-scale">
            <div className="w-20 h-20 bg-gradient-to-br from-green to-green-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your session with <span className="font-semibold text-accent">{trainer.name}</span> has been booked successfully. 
              The trainer will create a session and you'll be able to join via video call.
            </p>
            
            <div className="bg-gradient-to-r from-green-light to-cream-light p-6 rounded-2xl mb-8">
              <div className="text-sm text-gray-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Trainer:</span>
                  <span className="font-semibold">{trainer.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Amount Paid:</span>
                  <span className="font-semibold text-accent">${booking?.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment Method:</span>
                  <span className="font-semibold capitalize">{booking?.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span className="font-semibold text-green">Confirmed</span>
                </div>
                {booking?.paymentDetails?.paymentId && (
                  <div className="flex justify-between items-center">
                    <span>Payment ID:</span>
                    <span className="font-mono text-xs">{booking.paymentDetails.paymentId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Link to="/student/sessions" className="block w-full btn-primary">
                View My Sessions
              </Link>
              <Link to="/main" className="block w-full btn-secondary">
                Book Another Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-light to-cream-light">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-lg border-b border-white border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-coral rounded-xl flex items-center justify-center mr-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">LinguaConnect</span>
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Trainers
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Trainer Information */}
          <div className="space-y-8">
            <div className="card animate-slide-up">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-coral rounded-2xl flex items-center justify-center mr-6">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{trainer.name}</h2>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="font-semibold">{trainer.stats?.rating || 5.0}</span>
                    <span className="ml-2">({Math.floor(Math.random() * 200) + 50} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <div className="font-semibold">Languages</div>
                    <div className="text-sm">
                      {trainer.profile?.trainerLanguages?.length > 0 
                        ? trainer.profile.trainerLanguages.map(l => l.language).join(', ')
                        : trainer.profile?.languages?.join(', ') || 'English, Spanish, French'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-accent" />
                  <div>
                    <div className="font-semibold">Experience</div>
                    <div className="text-sm">{trainer.profile?.experience || 5}+ years</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {trainer.profile?.bio || 'Experienced language trainer helping students achieve fluency through personalized lessons and engaging conversations.'}
              </p>

              <div className="bg-gradient-to-r from-accent to-coral-dark p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Session Rate:</span>
                  <span className="text-3xl font-bold">
                    ${trainer.profile?.hourlyRate || 25}/hour
                  </span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
              <ul className="space-y-4 text-gray-600">
                {[
                  'One-on-one personalized session',
                  'HD video call via Jitsi Meet',
                  'Customized learning materials',
                  'Real-time feedback and corrections',
                  'Session recording (if requested)'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Book Your Session</h3>
              
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-fade-scale">
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              <Elements stripe={stripePromise}>
                <PaymentForm
                  trainer={trainer}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </Elements>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-light to-cream-light rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-4">How it works:</h4>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                    Complete payment to book your session
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                    Your trainer will create a session and send you the details
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                    Join the video call at the scheduled time
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</span>
                    Enjoy your personalized language learning experience!
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage