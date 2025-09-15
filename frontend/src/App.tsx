import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { StripeProvider } from './contexts/StripeContext'

// Components
import PrivateRoute from './components/PrivateRoute'
import LandingPage from './pages/LandingPage'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/student/StudentDashboard'
import EducatorDashboard from './pages/trainer/EducatorDashboard'
import BookingPage from './pages/BookingPage'
import SessionRoom from './pages/SessionRoom'
import TrainerProfile from './pages/TrainerProfile'

function App() {
  return (
    <StripeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-cream-50 to-green-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trainer-profile/:trainerId" element={<TrainerProfile />} />
              <Route path="/book/:trainerId" element={<BookingPage />} />
              
              <Route path="/student/*" element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/trainer/*" element={
                <PrivateRoute allowedRoles={['trainer']}>
                  <EducatorDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/session/:sessionId" element={
                <PrivateRoute allowedRoles={['student', 'trainer']}>
                  <SessionRoom />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </StripeProvider>
  );
}

export default App;