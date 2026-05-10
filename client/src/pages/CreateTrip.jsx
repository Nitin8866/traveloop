import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Calendar, MapPin, Search, Plus, ArrowRight, Sparkles } from 'lucide-react';

const CreateTrip = () => {
    const [formData, setFormData] = useState({ name: '', description: '', startDate: '', endDate: '', coverPhoto: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/trips', formData, { headers: { Authorization: `Bearer ${token}` } });
            navigate('/my-trips');
        } catch (err) { alert('Error'); }
    };

    const suggestions = [
        { name: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300' },
        { name: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300' },
        { name: 'Reykjavik, Iceland', img: 'https://images.unsplash.com/photo-1504541982953-47285567561a?auto=format&fit=crop&w=300' },
        { name: 'Bali, Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300' },
        { name: 'New York, USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=300' },
        { name: 'Rome, Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=300' },
    ];

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Plan a new trip</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Tell us your destination and dates to get started.</p>
                </div>

                <div className="premium-card" style={{ padding: '3rem', marginBottom: '4rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Journey Name</label>
                            <input type="text" placeholder="e.g. My Dream Europe Trip" style={{ width: '100%' }} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Select a Place</label>
                            <MapPin size={18} style={{ position: 'absolute', left: '16px', bottom: '16px', color: '#9CA3AF' }} />
                            <input type="text" placeholder="Search destinations..." style={{ width: '100%', paddingLeft: '48px' }} onChange={e => setFormData({...formData, coverPhoto: `https://source.unsplash.com/featured/?${e.target.value}`})} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Start Date</label>
                            <input type="date" style={{ width: '100%' }} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>End Date</label>
                            <input type="date" style={{ width: '100%' }} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '1.2rem', marginTop: '1rem' }}>
                            Create Itinerary <Plus size={20} />
                        </button>
                    </form>
                </div>

                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <Sparkles size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Suggestions for Places to Visit</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {suggestions.map((place, i) => (
                            <div key={i} className="premium-card" style={{ padding: '0.8rem', textAlign: 'center', cursor: 'pointer' }}>
                                <div style={{ height: '180px', borderRadius: '20px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <img src={place.img} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h4 style={{ fontWeight: 700 }}>{place.name}</h4>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default CreateTrip;
