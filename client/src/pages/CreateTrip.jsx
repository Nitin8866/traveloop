import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Calendar, MapPin, Search, Plus, ArrowRight, Sparkles, Navigation } from 'lucide-react';

const CreateTrip = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        description: '', 
        startDate: '', 
        endDate: '', 
        sourcePlace: '', 
        destinationPlace: '' 
    });
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mock Global Places for Search (Simulation of Select2 API)
    const allPlaces = ['London, UK', 'Paris, France', 'New York, USA', 'Tokyo, Japan', 'Dubai, UAE', 'Singapore', 'Rome, Italy', 'Berlin, Germany', 'Sydney, Australia', 'Mumbai, India', 'Barcelona, Spain', 'Amsterdam, Netherlands'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/trips', {
                ...formData,
                coverPhoto: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1400`
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            // Navigate to Itinerary Builder with the new trip ID
            navigate(`/itinerary/${res.data.id}`);
        } catch (err) { alert('Error creating trip'); }
    };

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Plan a new trip</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Map out your route and we will handle the suggestions.</p>
                </div>

                <div className="premium-card" style={{ padding: '3.5rem', marginBottom: '4rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Journey Name</label>
                            <input type="text" placeholder="e.g. Summer European Adventure 2024" style={{ width: '100%' }} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Source Place</label>
                            <div style={{ position: 'relative' }}>
                                <Navigation size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                <input list="places" type="text" placeholder="Start from (e.g. London)" style={{ width: '100%', paddingLeft: '48px' }} onChange={e => setFormData({...formData, sourcePlace: e.target.value})} required />
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Destination Place</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                <input list="places" type="text" placeholder="Going to (e.g. Paris)" style={{ width: '100%', paddingLeft: '48px' }} onChange={e => setFormData({...formData, destinationPlace: e.target.value})} required />
                            </div>
                        </div>

                        <datalist id="places">
                            {allPlaces.map((p, i) => <option key={i} value={p} />)}
                        </datalist>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Start Date</label>
                            <input type="date" style={{ width: '100%' }} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>End Date</label>
                            <input type="date" style={{ width: '100%' }} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                        </div>

                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '1.2rem', marginTop: '1rem', fontSize: '1.1rem' }}>
                            Generate Intelligent Route <Plus size={20} />
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', border: '2px dashed #eee', borderRadius: '32px' }}>
                    <Sparkles size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <p>Enter your Source and Destination to see real-time stop suggestions!</p>
                </div>
            </div>
        </Layout>
    );
};

export default CreateTrip;
