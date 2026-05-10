import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { MapPin, Calendar, Compass, ArrowRight, Sparkles, Loader2, ArrowLeft } from 'lucide-react';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [destinationSearch, setDestinationSearch] = useState('');
    const [destinationResults, setDestinationResults] = useState([]);
    
    // Load initial state from LocalStorage or use defaults
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('traveloop_draft_trip');
        return saved ? JSON.parse(saved) : {
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            destinationPlace: ''
        };
    });

    // Initialize search field from saved data
    useEffect(() => {
        if (formData.destinationPlace && !destinationSearch) {
            setDestinationSearch(formData.destinationPlace);
        }
    }, []);

    // Sync form data to LocalStorage on every change
    useEffect(() => {
        localStorage.setItem('traveloop_draft_trip', JSON.stringify(formData));
    }, [formData]);

    // Photon API for Global Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (destinationSearch.length > 2) {
                const res = await axios.get(`https://photon.komoot.io/api/?q=${destinationSearch}&limit=5`);
                setDestinationResults(res.data.features);
            } else {
                setDestinationResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [destinationSearch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.destinationPlace) {
            alert('Please select a destination from the dropdown.');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/trips', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/itinerary/${res.data.id}`);
        } catch (error) {
            console.error('Error creating trip:', error);
            alert('Failed to create trip.');
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '4rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ width: '50px', height: '50px', borderRadius: '15px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '0.5rem' }}>Plan your Destination</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your data is automatically saved as you type.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="premium-card" style={{ padding: '4rem', background: 'white', borderRadius: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
                        {/* Journey Name */}
                        <div className="form-group">
                            <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block', fontSize: '0.9rem' }}>Journey Name</label>
                            <div style={{ position: 'relative' }}>
                                <Compass size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    placeholder="e.g. Summer Break 2026" 
                                    style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontSize: '1rem', fontWeight: 600 }}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Destination Selection */}
                        <div className="form-group">
                            <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block', fontSize: '0.9rem' }}>Destination Place</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#EC4899' }} />
                                <input 
                                    type="text" 
                                    value={destinationSearch}
                                    placeholder="Where do you want to go?" 
                                    style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontSize: '1rem', fontWeight: 600 }}
                                    onChange={(e) => {
                                        setDestinationSearch(e.target.value);
                                        setFormData({...formData, destinationPlace: e.target.value});
                                    }}
                                    required
                                />
                                {destinationResults.length > 0 && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', zIndex: 100, borderRadius: '18px', marginTop: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                                        {destinationResults.map((r, i) => (
                                            <div key={i} style={{ padding: '15px 25px', cursor: 'pointer', borderBottom: '1px solid #F8FAFC', fontWeight: 600 }} onClick={() => {
                                                const name = `${r.properties.name || ''}, ${r.properties.city || ''}, ${r.properties.country || ''}`;
                                                setFormData({...formData, destinationPlace: name});
                                                setDestinationSearch(name);
                                                setDestinationResults([]);
                                            }}>
                                                <MapPin size={14} style={{ marginRight: '10px', color: '#EC4899' }} /> {r.properties.name}, {r.properties.city}, {r.properties.country}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="form-group">
                                <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block', fontSize: '0.9rem' }}>Start Date</label>
                                <input 
                                    type="date" 
                                    value={formData.startDate}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontSize: '1rem', fontWeight: 600 }}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block', fontSize: '0.9rem' }}>End Date</label>
                                <input 
                                    type="date" 
                                    value={formData.endDate}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontSize: '1rem', fontWeight: 600 }}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ padding: '1.5rem', borderRadius: '22px', fontSize: '1.2rem', marginTop: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={24} /> Continue Selection</>}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateTrip;
