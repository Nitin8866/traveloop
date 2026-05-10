import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Calendar, MapPin, Search, Plus, ArrowRight, Sparkles, Navigation, Loader2 } from 'lucide-react';

const CreateTrip = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        description: '', 
        startDate: '', 
        endDate: '', 
        sourcePlace: '', 
        destinationPlace: '' 
    });
    const [suggestions, setSuggestions] = useState({ source: [], destination: [] });
    const [loading, setLoading] = useState({ source: false, destination: false });
    const [activeDropdown, setActiveDropdown] = useState(null); // 'source' or 'destination'
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Fetch places from Photon (OpenStreetMap) API
    const fetchPlaces = async (query, type) => {
        if (query.length < 3) {
            setSuggestions(prev => ({ ...prev, [type]: [] }));
            return;
        }
        setLoading(prev => ({ ...prev, [type]: true }));
        try {
            const res = await axios.get(`https://photon.komoot.io/api/?q=${query}&limit=5`);
            const places = res.data.features.map(f => {
                const p = f.properties;
                return `${p.name ? p.name : ''}${p.state ? ', ' + p.state : ''}${p.country ? ', ' + p.country : ''}`;
            });
            setSuggestions(prev => ({ ...prev, [type]: [...new Set(places)] })); // Unique results
        } catch (err) { console.error("API Error:", err); }
        setLoading(prev => ({ ...prev, [type]: false }));
    };

    const handleSelect = (place, type) => {
        setFormData({ ...formData, [type === 'source' ? 'sourcePlace' : 'destinationPlace']: place });
        setSuggestions(prev => ({ ...prev, [type]: [] }));
        setActiveDropdown(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/trips', {
                ...formData,
                coverPhoto: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1400`
            }, { headers: { Authorization: `Bearer ${token}` } });
            navigate(`/itinerary/${res.data.id}`);
        } catch (err) { alert('Error creating trip'); }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Plan a new trip</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Map out your route with real-world global destination search.</p>
                </div>

                <div className="premium-card" style={{ padding: '3.5rem', marginBottom: '4rem', overflow: 'visible' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Journey Name</label>
                            <input type="text" placeholder="e.g. My Grand World Tour" style={{ width: '100%' }} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        
                        {/* Source Place Search */}
                        <div style={{ position: 'relative' }} ref={dropdownRef}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Source Place</label>
                            <div style={{ position: 'relative' }}>
                                <Navigation size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                <input 
                                    type="text" 
                                    value={formData.sourcePlace}
                                    placeholder="Start City, State, Country" 
                                    style={{ width: '100%', paddingLeft: '48px' }} 
                                    onChange={e => {
                                        setFormData({...formData, sourcePlace: e.target.value});
                                        fetchPlaces(e.target.value, 'source');
                                        setActiveDropdown('source');
                                    }} 
                                    required 
                                />
                                {loading.source && <Loader2 size={16} className="animate-spin" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />}
                            </div>
                            {activeDropdown === 'source' && suggestions.source.length > 0 && (
                                <div className="premium-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, marginTop: '8px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                    {suggestions.source.map((p, i) => (
                                        <div key={i} onClick={() => handleSelect(p, 'source')} style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: '0.2s' }} className="suggestion-item">
                                            <MapPin size={14} style={{ marginRight: '8px', display: 'inline' }} /> {p}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Destination Place Search */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Destination Place</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                <input 
                                    type="text" 
                                    value={formData.destinationPlace}
                                    placeholder="Destination City, State, Country" 
                                    style={{ width: '100%', paddingLeft: '48px' }} 
                                    onChange={e => {
                                        setFormData({...formData, destinationPlace: e.target.value});
                                        fetchPlaces(e.target.value, 'destination');
                                        setActiveDropdown('destination');
                                    }} 
                                    required 
                                />
                                {loading.destination && <Loader2 size={16} className="animate-spin" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />}
                            </div>
                            {activeDropdown === 'destination' && suggestions.destination.length > 0 && (
                                <div className="premium-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, marginTop: '8px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                    {suggestions.destination.map((p, i) => (
                                        <div key={i} onClick={() => handleSelect(p, 'destination')} style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: '0.2s' }} className="suggestion-item">
                                            <MapPin size={14} style={{ marginRight: '8px', display: 'inline' }} /> {p}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

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
                    <p>Enter a City name to search across the entire globe!</p>
                </div>
            </div>
            
            <style>{`
                .suggestion-item:hover { background: #F3F4F6; color: var(--primary); }
            `}</style>
        </Layout>
    );
};

export default CreateTrip;
