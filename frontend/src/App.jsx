import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'
import Dashboard from './pages/user/Dashboard'
import CreateListing from './pages/user/CreateListing'
import MyListings from './pages/user/MyListings'
import ListingDetail from './pages/user/ListingDetail'
import TrackPickup from './pages/user/TrackPickup'
import VendorDashboard from './pages/vendor/VendorDashboard'
import BrowseListings from './pages/vendor/BrowseListings'
import MyPickups from './pages/vendor/MyPickups'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import useAuthStore from './store/authStore'
import { getProfile } from './api/auth'
import RealTimeNotification from './components/ui/RealTimeNotification'
import ErrorBoundary from './components/ui/ErrorBoundary'

function App() {
  const { accessToken, user, setUser, logout, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const fetchProfile = async () => {
      if (accessToken && !user && isAuthenticated) {
        try {
          const res = await getProfile()
          setUser(res.data)
        } catch (error) {
          console.error("Auth sync failed", error)
          logout()
        }
      }
    }
    fetchProfile()
  }, [accessToken, user, setUser, logout, isAuthenticated])

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute role="USER">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/listings/create" element={
                <ProtectedRoute role="USER">
                  <CreateListing />
                </ProtectedRoute>
              } />
               <Route path="/listings/my" element={
                <ProtectedRoute role="USER">
                  <MyListings />
                </ProtectedRoute>
              } />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/orders/:id/track" element={
                <ProtectedRoute role="USER">
                  <TrackPickup />
                </ProtectedRoute>
              } />

              <Route path="/vendor/dashboard" element={
                <ProtectedRoute role="VENDOR">
                  <VendorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/vendor/browse" element={<BrowseListings />} />
              <Route path="/vendor/pickups" element={
                <ProtectedRoute role="VENDOR">
                  <MyPickups />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <RealTimeNotification />
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App
