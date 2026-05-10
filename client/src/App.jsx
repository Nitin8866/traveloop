import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripUtilities from './pages/TripUtilities';
import Profile from './pages/Profile';
import Invoice from './pages/Invoice';
import Explore from './pages/Explore';
import ItineraryView from './pages/ItineraryView';
import Community from './pages/Community';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import TripNotes from './pages/TripNotes';
import PackingChecklist from './pages/PackingChecklist';
import PublicItinerary from './pages/PublicItinerary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/DesignSystem.css';

// Protected Route wrapper — redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

// Admin-only route wrapper
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
    
    // Check if either context user is admin OR if we have valid admin session in localStorage
    if (adminUser || (user && user.role === 'admin')) {
        return children;
    }
    
    return <Navigate to="/admin/login" replace />;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/share/:tripId" element={<PublicItinerary />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
            <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
            <Route path="/itinerary/:tripId" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
            <Route path="/itinerary-view/:tripId" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
            <Route path="/utilities/:tripId" element={<ProtectedRoute><TripUtilities /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/invoice/:tripId" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/notes/:tripId" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
            <Route path="/packing/:tripId" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />

            {/* Admin routes with Sub-Routing */}
            <Route path="/admin" element={<AdminRoute><AdminPanel tab="overview" /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminPanel tab="users" /></AdminRoute>} />
            <Route path="/admin/cities" element={<AdminRoute><AdminPanel tab="cities" /></AdminRoute>} />
            <Route path="/admin/activities" element={<AdminRoute><AdminPanel tab="activities" /></AdminRoute>} />
            <Route path="/admin/trends" element={<AdminRoute><AdminPanel tab="trends" /></AdminRoute>} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <AppRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
