import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import TripNotes from './pages/TripNotes';
import PackingChecklist from './pages/PackingChecklist';
import PublicItinerary from './pages/PublicItinerary';
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/invoice/:tripId" element={<Invoice />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/itinerary-view/:tripId" element={<ItineraryView />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/notes/:tripId" element={<TripNotes />} />
            <Route path="/packing/:tripId" element={<PackingChecklist />} />
            <Route path="/share/:tripId" element={<PublicItinerary />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
