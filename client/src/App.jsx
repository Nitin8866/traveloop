import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripUtilities from './pages/TripUtilities';
import { AuthProvider } from './contexts/AuthContext';
import './styles/DesignSystem.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/itinerary/:tripId" element={<ItineraryBuilder />} />
            <Route path="/utilities/:tripId" element={<TripUtilities />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
